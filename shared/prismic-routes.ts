import { prismicDocumentType, type PrismicDocumentType } from './prismic-document'

export const prismicDocumentRoutes = [
	{
		name: 'index',
		type: prismicDocumentType.HOME_PAGE,
		path: '/:lang?',
	},
	{
		name: 'archive',
		type: prismicDocumentType.ARCHIVE_PAGE,
		path: '/:lang?/archive',
	},
	{
		name: 'about',
		type: prismicDocumentType.ABOUT_PAGE,
		path: '/:lang?/a-propos',
	},
	{
		name: 'projets',
		type: prismicDocumentType.PROJECT_LISTING_PAGE,
		path: '/:lang?/projets',
		alias: ['/:lang?', '/:lang?/projets', '/:lang?/projects'],
	},
	{
		name: 'projet',
		type: prismicDocumentType.PROJECT_PAGE,
		path: '/:lang?/projets/:uid',
		alias: ['/:lang?/projects/:uid'],
	},
] as const

export type PrismicDocumentRoutes = typeof prismicDocumentRoutes
export type PrismicDocumentRoute = PrismicDocumentRoutes[number]

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

export function isPrismicDocumentRoute(route: object) {
	const type = 'type' in route && typeof route.type === 'string' && route.type
	const hasPath = 'path' in route && typeof route.path === 'string' && route.path

	return hasPath && prismicDocumentRoutes.some(r => r.type === type)
}
