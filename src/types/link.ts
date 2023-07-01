const isRelativePath = (path?: string): boolean => {
    return !!path && path.charAt(0) === '/'
}

const checkDomain = (url?: string): string => {
    if (!url) return ''
    if (url.indexOf('//') === 0) {
        url = location.protocol + url
    }
    return url
        .toLowerCase()
        .replace(/([a-z])?:\/\//, '$1')
        .split('/')[0]
}

const isExternalPath = (url?: string): boolean => {
    return (
        !!url &&
        ((url.length > 1 && url.includes(':')) || url.includes('//')) &&
        checkDomain(location.href) !== checkDomain(url)
    )
}

export { isRelativePath, checkDomain, isExternalPath }
