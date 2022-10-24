import * as core from '@actions/core'
import * as github from '@actions/github'
import * as fs from 'fs'
import * as path from 'path';
import multimatch from 'multimatch';
import { removeHtmlTags, replaceRelativeRootUrls } from './md-helpers';
import { Contributor, ExternalLink, ZenodoJson, OctokitApi, GithubTreeItem, ContentFile, DatasourceContent, FolderDatasourceContent, FileDatasourceContent, OpenDataDatasource, CitationCff } from './models'
import * as _ from 'lodash';
import { load } from 'js-yaml';

const DefaultBranch: string = 'master';
const ContentPathPredicates: ((x: string) => boolean)[] = [
    x => !x.startsWith('.') && !x.startsWith('Archiv'),
    x => !_.includes(['LIZENZ', 'LICENSE', 'CITATION.cff'], x)
];
const TagBlacklist: string[] = ['germany', 'deutschland', 'rki'];
const lfsSizeRegEx = /^size\s(?<size>[0-9]*)$/gm;

async function readDoi(octokit: OctokitApi, repo: { owner: string, repo: string, homepage: string | null }, tree: GithubTreeItem[]) {
    const result = { doi: '', links: [] as ExternalLink[] };

    const citationCffNode = tree.find(x => x.path && _.endsWith(x.path.toLowerCase(), 'citation.cff'));
    if (citationCffNode && citationCffNode.path) {
        const { data: citationCffContent } = await octokit.rest.repos.getContent({ ...repo, path: citationCffNode.path });
        const citationCffContentFile = citationCffContent as ContentFile;
        if (citationCffContentFile && citationCffContentFile.encoding === 'base64') {

            const buffer = Buffer.from(citationCffContentFile.content, 'base64');
            const citationContentString = buffer.toString();
            const cff = load(citationContentString) as CitationCff;
            result.doi = cff.doi;
            result.links.push({ $type: 'zenodo' as const, url: `https://doi.org/${cff.doi}` });
        }
    }
    else if (repo.homepage && repo.homepage.includes('doi.org')) {
        result.links.push({ $type: 'zenodo' as const, url: repo.homepage });
        result.doi = repo.homepage;
    }

    return result;
}

async function readZenodoJson(octokit: OctokitApi, repo: { owner: string, repo: string }, tree: GithubTreeItem[]) {
    const zenodoContentResult = { contributors: [] as { name: string, role: string }[], lastUpdated: new Date(), tags: [] as string[], name: repo.repo, authors: [] as string[], description: '' };
    const zenodoJsonNode = tree.find(x => x.path && _.endsWith(x.path.toLowerCase(), 'zenodo.json'));
    if (zenodoJsonNode && zenodoJsonNode.path) {
        const { data: zenodoJsonContent } = await octokit.rest.repos.getContent({ ...repo, path: zenodoJsonNode.path });
        const zenodoJsonContentFile = zenodoJsonContent as ContentFile;
        if (zenodoJsonContentFile && zenodoJsonContentFile.encoding === 'base64') {

            const buffer = Buffer.from(zenodoJsonContentFile.content, 'base64');
            const zenodoContentString = buffer.toString();

            const zenodoJson = JSON.parse(zenodoContentString) as ZenodoJson;
            zenodoContentResult.name = zenodoJson.title;
            zenodoContentResult.lastUpdated = zenodoJson.publication_date;
            zenodoContentResult.contributors = zenodoJson.contributors
                ? zenodoJson.contributors.map(x => ({ name: x.name, role: x.type }))
                : [];
            zenodoContentResult.authors = zenodoJson.creators
                ? zenodoJson.creators.map(x => x.name)
                : [];
            zenodoContentResult.description = zenodoJson.description;
            zenodoContentResult.tags = zenodoJson.keywords.filter(x => !TagBlacklist.includes(x.toLowerCase()));
        }
    }
    return zenodoContentResult;
}

async function readReadmeMd(octokit: OctokitApi, repo: { owner: string, repo: string }, branch: string, tree: GithubTreeItem[]) {
    const readmeNode = tree.find(x => x.path && x.path.toLowerCase() === 'readme.md');
    if (readmeNode && readmeNode.path) {
        const { data: readmeContent } = await octokit.rest.repos.getContent({ ...repo, path: readmeNode.path });
        const readmeContentFile = readmeContent as ContentFile;
        if (readmeContentFile && readmeContentFile.encoding === 'base64') {
            // console.log("ZENODO FOUND, CONTENT:", zenodoJsonContentFile);

            const buffer = Buffer.from(readmeContentFile.content, 'base64');
            let readmeContentString = buffer.toString();

            const firstH2Index = readmeContentString.indexOf('##');
            if (firstH2Index !== -1) {
                readmeContentString = readmeContentString.substr(firstH2Index);
            }

            readmeContentString = removeHtmlTags(readmeContentString, ['font']);
            readmeContentString = replaceRelativeRootUrls(readmeContentString, `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}`);

            return readmeContentString;
        }
    }
    return '';
}

async function createLfsFileDescriminator(octokit: OctokitApi, repo: { owner: string, repo: string }, tree: GithubTreeItem[]) {
    let isLfsFile = (x: string) => false;
    const gitattrNode = tree.find(x => x.path && x.path.toLowerCase() === '.gitattributes');
    if (gitattrNode && gitattrNode.path) {
        const { data: gitattrContent } = await octokit.rest.repos.getContent({ ...repo, path: gitattrNode.path });
        const gitattrContentFile = gitattrContent as ContentFile;
        if (gitattrContentFile && gitattrContentFile.encoding === 'base64') {

            const buffer = Buffer.from(gitattrContentFile.content, 'base64');
            const gitattrContentString = buffer.toString();

            const lfsLineRegEx = /^(?<glob>.*)\sfilter=lfs\sdiff=lfs\smerge=lfs\s-text$/gm;

            const lfsGlobs: string[] = [];

            let regExResult;

            while ((regExResult = lfsLineRegEx.exec(gitattrContentString)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (regExResult.index === lfsLineRegEx.lastIndex) {
                    lfsLineRegEx.lastIndex++;
                }

                if (regExResult.groups) {
                    const { groups: { glob } } = regExResult;
                    if (glob) {
                        lfsGlobs.push(glob);
                    }
                }


            }

            if (lfsGlobs.length > 0) {
                isLfsFile = x => {
                    const matched = multimatch([x], lfsGlobs);
                    return matched.length === 1 && matched[0] === x;
                };
            }
        }
    }
    return isLfsFile;
}

async function createFile(octokit: OctokitApi, item: GithubTreeItem, isLfs: boolean, repo: { repo: string, owner: string }, branch: string): Promise<FileDatasourceContent> {
    if (item.type !== 'blob') {
        throw new Error("Item has to be a 'blob'.");
    }
    if (!item.path) {
        throw new Error('Item needs a path.');
    }

    const getLfsSize = async (path: string): Promise<number> => {
        const { data } = await octokit.rest.repos.getContent({ ...repo, path });
        if (!Array.isArray(data) && data.type === 'file') {
            return data.size;
        }

        return 0;
    }

    const rawUrl = `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${item.path}`;
    const mediaUrl = `https://media.githubusercontent.com/media/${repo.owner}/${repo.repo}/${branch}/${item.path}`;

    const previewUrl = isLfs
        ? mediaUrl// this.urlBuilder.buildLfsPreview(repoInfo.name, repoInfo.branch, item.path)
        : rawUrl; //this.urlBuilder.buildPreview(repoInfo.name, repoInfo.branch, item.path);

    const downloadUrl = isLfs
        ? mediaUrl //this.urlBuilder.buildLfsDownload(repoInfo.name, repoInfo.branch, item.path)
        : rawUrl; //this.urlBuilder.buildDownload(repoInfo.name, repoInfo.branch, item.path);

    const visitUrl = isLfs
        ? mediaUrl //this.urlBuilder.buildLfsVisit(repoInfo.name, repoInfo.branch, item.path)
        : rawUrl; //this.urlBuilder.buildVisit(repoInfo.name, repoInfo.branch, item.path)

    const name = _.last(item.path!.split('/'));

    const size = isLfs
        ? await getLfsSize(item.path)
        : item.size!;

    return {
        $type: 'file',
        path: item.path,
        name: name!,
        downloadUrl,
        previewUrl,
        visitUrl,
        size,
        lfs: isLfs
    }
}

async function treeIt(octokit: OctokitApi, items: GithubTreeItem[], isLfsFile: (x: string) => boolean, repo: { repo: string, owner: string }, branch: string) {



    const result: DatasourceContent[] = [];
    const folders = new Map<string, FolderDatasourceContent>();

    for (const item of items) {
        if (item.type === 'blob' && item.path) {
            const splittedFilePath = item.path.split('/');

            for (let i = 0; i < splittedFilePath.length; i++) {
                const name = splittedFilePath[i];
                // let dsContent: DatasourceContent;

                if (i === splittedFilePath.length - 1) {
                    const folderPath = _.initial(splittedFilePath).join('/');
                    const file = await createFile(octokit, item, isLfsFile(item.path!), repo, branch);
                    if (splittedFilePath.length === 1) {
                        result.push(file);
                    } else {
                        folders.get(folderPath)!.content.push(file);
                    }
                } else {
                    const folderPath = splittedFilePath.join('/');
                    if (!folders.has(folderPath)) {
                        const folder: FolderDatasourceContent = {
                            content: [],
                            path: folderPath,
                            name,
                            $type: 'folder'
                        };
                        folders.set(folderPath, folder);
                        if (folderPath === name) {
                            result.push(folder);
                        } else {
                            folders.get(folderPath)!.content.push(folder);
                        }
                    }
                }
            }
        }
    }

    return result;
}

async function run() {
    const ghToken = core.getInput('GH_TOKEN');

    const octokit = github.getOctokit(ghToken);
    const { data: repo } = await octokit.rest.repos.get(github.context.repo);
    const branch = repo.default_branch || DefaultBranch;

    core.info(`Creating datasource.json for repo '${github.context.repo.owner}/${github.context.repo.repo}'.`);

    const externalLinks: ExternalLink[] = [
        { $type: 'github', url: repo.html_url }
    ];

    const { data: { tree } } = await octokit.rest.git.getTree({ ...github.context.repo, tree_sha: branch, recursive: '1' });
    const zenodoContent$ = readZenodoJson(octokit, github.context.repo, tree);
    const doi$ = readDoi(octokit, { ...github.context.repo, homepage: repo.homepage }, tree);
    const readmeContent$ = readReadmeMd(octokit, github.context.repo, branch, tree);

    const isLfsFile = await createLfsFileDescriminator(octokit, github.context.repo, tree);
    const relevantTreeItems = tree.filter(node => node.path && ContentPathPredicates.every(x => x(node.path!)));
    const content = await treeIt(octokit, relevantTreeItems, isLfsFile, github.context.repo, branch);
    const { doi, links } = await doi$;
    // const tags = (await topics$).data.names.filter(x => !TagBlacklist.includes(x.toLowerCase()));

    const datasourceJson: OpenDataDatasource = {
        id: repo.name,
        branch,
        externalLinks: externalLinks.concat(links),
        doi,
        ...(await zenodoContent$),
        readme: await readmeContent$,
        licence: repo.license?.spdx_id || '',
        content: _.orderBy(content, x => `${x.$type}_${x.path}`)
    };

    core.info(`Created datasource.json with\n${JSON.stringify(datasourceJson)}`);

    const dir = './src/app/data/datasource.json';

    core.info(`Writing datasource.json to '${dir}'.`);

    fs.writeFileSync(dir, JSON.stringify(datasourceJson));
}

run().catch(err => core.setFailed("Workflow to create datasource.json failed!\nError:" + err.message))



