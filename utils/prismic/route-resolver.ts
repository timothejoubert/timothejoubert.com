// https://prismic.io/docs/route-resolver#resolvers
// https://prismic.io/docs/nuxt-3-define-routes
import { DocumentType } from '#root/constants/document-type'
import { extractValueBetweenOccurrence } from '#root/utils/string/extract'
import { I18N_LOCALES } from '#root/i18n.config'

export const prismicDocumentRouteList = [
    {
        type: DocumentType.PROJECT_LISTING,
        path: '/:lang?',
        alias: ['/:lang?', '/:lang?/projects', '/:lang?/projets'],
    },
    {
        type: DocumentType.ARCHIVE,
        path: '/:lang?/archive',
    },
    {
        type: DocumentType.HOME,
        path: '/not-exist',
    },
    {
        type: DocumentType.ABOUT,
        path: '/:lang?/a-propos',
        alias: ['/:lang?/bio'],
    },
    {
        type: DocumentType.PROJECT,
        path: '/:lang?/projets/:uid',
        alias: ['/:lang?/projects/:uid'],
    },
]

// TODO: find item by alias too
export function mapRoutePathToPrismicDocument(path: string) {
    const firstSegment = extractValueBetweenOccurrence(path, '/', [1, 2]) || ''

    const route = prismicDocumentRouteList.find((prismicRoute) => {
        if (path === prismicRoute.path) return true

        // Replace locale or uid if exist
        const hasLocale = I18N_LOCALES.includes(firstSegment as (typeof I18N_LOCALES)[number])
        const dynamicUid = prismicRoute.path?.includes(':uid') && path.substring(path.lastIndexOf('/') + 1)

        const filteredPath = prismicRoute.path
            ?.replace('/:lang?', hasLocale ? `/${firstSegment}` : '')
            .replace(':uid', dynamicUid || '') || '/'

        return path === filteredPath
    })

    if (route) return route.type

    return DocumentType.ERROR_PAGE
}

export function getDocumentRoutePath(documentType: DocumentType) {
    const currentRoute = prismicDocumentRouteList.find(route => route.type === documentType)

    return currentRoute?.path?.replace('/:lang?', '').replace(':uid', '')
}
