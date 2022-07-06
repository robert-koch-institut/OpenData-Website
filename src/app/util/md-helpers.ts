

export function replaceRelativeRootUrls(content: string, baseUrl: string){
    const figureUrlRegEx = /!\[(?<title>.*?)\]\((?<url>\/.*?)\)/gs;
    const linkUrlRegEx = /\[(?<title>.*?)\]\((?<url>\/.*?)\)/g;

    content = content.replace(figureUrlRegEx, `![$<title>](${baseUrl}$<url>)`);
    return content.replace(linkUrlRegEx, `[$<title>](${baseUrl}$<url>)`);
}

export function removeHtmlTags(content: string, tags: string[]) {
    return tags.reduce((prev, curr) => {
        const regEx = new RegExp(`\<${curr}.*?\>(?<inner>.+?)\<\/${curr}\>`, 'gs');
        return prev.replace(regEx, '$<inner>');
    }, content);
}