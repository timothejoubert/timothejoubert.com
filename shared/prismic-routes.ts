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
		name: 'projet',
		type: prismicDocumentType.PROJECT_PAGE,
		path: '/:lang?/:uid',
	},
	{
		name: 'projet-archive',
		type: prismicDocumentType.PROJECT_PAGE,
		path: '/:lang?/archive/:uid',
	},
] as const

export type PrismicDocumentRoutes = typeof prismicDocumentRoutes
export type PrismicDocumentRoute = PrismicDocumentRoutes[number]
export type PrismicRouteName = PrismicDocumentRoute['name']

/** Lookup par nom de route (sans collision, contrairement à prismicDocumentRoute par type). */
export const prismicRouteByName = prismicDocumentRoutes.reduce((acc, route) => {
	Object.assign(acc, { [route.name]: route })
	return acc
}, {} as Record<PrismicRouteName, PrismicDocumentRoute>)

/**
 * Retourne le chemin résolu d'une route Prismic.
 * Dérive depuis prismicDocumentRoutes (source unique de vérité).
 * @example getRoutePath('archive')               // '/archive'
 * @example getRoutePath('projet', { uid: 'foo' }) // '/foo'
 */
export function getRoutePath(name: PrismicRouteName, params?: Record<string, string>): string {
	const route = prismicRouteByName[name]
	let path = (route.path as string).replace('/:lang?', '') || '/'

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			path = path.replace(`:${key}`, value)
		}
	}

	return path
}

/** @deprecated Indexé par type — collision si plusieurs routes partagent le même type. Préférer prismicRouteByName. */
export const prismicDocumentRoute = prismicDocumentRoutes.reduce((acc, route) => {
	Object.assign(acc, { [route.type]: route })
	return acc
}, {} as Record<PrismicDocumentType, PrismicDocumentRoute>)

export function isPrismicDocumentRoute(route: object) {
	const type = 'type' in route && typeof route.type === 'string' && route.type
	const hasPath = 'path' in route && typeof route.path === 'string' && route.path

	return hasPath && prismicDocumentRoutes.some(r => r.type === type)
}
