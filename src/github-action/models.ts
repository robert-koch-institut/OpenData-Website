import { Octokit } from '@octokit/core';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';
import { components } from "@octokit/openapi-types";

export interface Community {
    identifier: string;
}

export interface Creator {
    name: string;
    affiliation: string;
}

export interface Contributor {
    name: string;
    affiliation: string;
    orcid: string;
    type: string;
}

export interface Subject {
    term: string;
    identifier: string;
}

export interface ZenodoJson {
    title: string;
    description: string;
    upload_type: string;
    access_right: string;
    license: string;
    language: string;
    communities: Community[];
    creators: Creator[];
    contributors: Contributor[];
    keywords: string[];
    subjects: Subject[];
    publication_date: Date;
}

export interface ExternalLink {
    $type: 'github' | 'zenodo';
    url: string;
}


export type OctokitApi = Octokit & Api;
export type ContentFile = components["schemas"]["content-file"];

export type GithubTreeItem = {
    path?: string | undefined;
    mode?: string | undefined;
    type?: string | undefined;
    sha?: string | undefined;
    size?: number | undefined;
    url?: string | undefined;
};


export interface FileDatasourceContent {
    $type: 'file';
    name: string;
    path: string;
    previewUrl: string;
    downloadUrl: string;
    visitUrl: string;
    lfs: boolean;
}

export interface FolderDatasourceContent {
    $type: 'folder';
    name: string;
    path: string;

    content: DatasourceContent[];
}

export type DatasourceContent = FileDatasourceContent | FolderDatasourceContent;


export interface OpenDataDatasource {
    id: string;

    branch: string;
    name: string;
    description: string;

    licence: string;
    tags: string[];
    doi: string;
    lastUpdated: Date;
    contributors: { name: string, role: string }[];
    authors: string[];
    externalLinks: ExternalLink[];
    readme: string;

    content: DatasourceContent[];
}