export const SETTINGS_TYPE = 'settings'
export const MAIN_MENU_TYPE = 'main_menu'

export const HOME_PAGE_TYPE = 'home_page'
export const ARCHIVE_TYPE = 'archive'
export const ABOUT_TYPE = 'about'
export const PROJECT_LISTING_TYPE = 'project_listing_page'
export const PROJECT_TYPE = 'project'

export const prismicDocumentRoutes = [
    {
        name: 'index',
        type: HOME_PAGE_TYPE,
        path: '/:lang?',
    },
    {
        name: 'archive',
        type: ARCHIVE_TYPE,
        path: '/:lang?/archive',
    },
    {
        name: 'about',
        type: ABOUT_TYPE,
        path: '/:lang?/a-propos',
    },
    {
        name: 'projets',
        type: PROJECT_LISTING_TYPE,
        path: '/:lang?/projets',
        alias: ['/:lang?', '/:lang?/projets', '/:lang?/projects'],
    },
    {
        name: 'projet',
        type: PROJECT_TYPE,
        path: '/:lang?/projets/:uid',
        alias: ['/:lang?/projects/:uid'],
    },
] as const

export type PrismicDocumentRoutes = typeof prismicDocumentRoutes
export type PrismicDocumentRoute = PrismicDocumentRoutes[number]
export type PrismicDocumentType = PrismicDocumentRoute['type']

export const prismicDocumentName = prismicDocumentRoutes.reduce((acc, route) => {
    const type = route.type
    Object.assign(acc, { [type]: type })

    return acc
}, {} as Record<PrismicDocumentType, PrismicDocumentType>)

export const prismicDocumentRoute = prismicDocumentRoutes.reduce((acc, route) => {
    const type = route.type
    Object.assign(acc, { [type]: route })

    return acc
}, {} as Record<PrismicDocumentType, PrismicDocumentRoute>)
