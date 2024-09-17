// https://prismic.io/docs/route-resolver#resolvers
// https://prismic.io/docs/nuxt-3-define-routes
import { DocumentType } from '~/constants/document-type'
import { extractValueBetweenOccurrence } from '~/utils/string/extract'
import { I18N_LOCALES } from '~/i18n.config'

export const prismicDocumentRouteList = [
    {
        type: DocumentType.ERROR_PAGE,
        path: '/404',
    },
    {
        type: DocumentType.HOME,
        path: '/:lang?',
    },
    {
        type: DocumentType.ABOUT,
        path: '/:lang?/bio',
    },
    {
        type: DocumentType.PROJECT_LISTING,
        path: '/:lang?/projets',
    },
    {
        type: DocumentType.PROJECT,
        path: '/:lang?/projets/:uid',
    },
    {
        type: DocumentType.WEB_PAGE,
        path: '/:lang?/:uid',
    },
]

export function mapRoutePathToPrismicDocument(path: string) {
    const firstRoute = extractValueBetweenOccurrence(path, '/', [1, 2]) || ''

    const route = prismicDocumentRouteList.find((prismicRoute) => {
        if (path === prismicRoute.path) return true
        // Replace locale or uid if exist
        const hasLocale = I18N_LOCALES.includes(firstRoute as (typeof I18N_LOCALES)[number])
        const dynamicUid = prismicRoute.path?.includes(':uid') && path.substring(path.lastIndexOf('/') + 1)

        const filteredPath
      = prismicRoute.path?.replace('/:lang?', hasLocale ? `/${firstRoute}` : '').replace(':uid', dynamicUid || '') || '/'

        return path === filteredPath
    })

    if (route) return route.type

    return DocumentType.ERROR_PAGE
}

export function getDocumentRoutePath(documentType: DocumentType) {
    const currentRoute = prismicDocumentRouteList.find(route => route.type === documentType)

    return currentRoute?.path?.replace('/:lang?', '').replace(':uid', '')
}
