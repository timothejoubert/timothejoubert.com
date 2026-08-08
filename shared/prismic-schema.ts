import type { PrismicDocumentType } from '~/types/api'

/**
 * Single source of truth for every Prismic document type used in the app: its identity (friendly
 * name) and, if it's a routable page, its route(s). To add a new document type to the site:
 * 1. Create the custom type in Prismic, run `pnpm type-gen`.
 * 2. Add a friendly constant to `prismicDocumentType` below.
 * 3. If it's a routable page, add an entry to `prismicDocumentRoutes` below.
 * `PrismicDocumentPageType` and `isDynamicDocument` derive from `prismicDocumentRoutes`
 * automatically — no other manual wiring needed.
 */

/**
 * Friendly named constants for every Prismic document type used in the app (routable pages and
 * singleton config documents like `settings`/`menu` alike). `satisfies` ties each value back to
 * `PrismicDocumentType` (itself derived from the generated `prismicio-types.d.ts`), so a
 * renamed/removed custom type fails to compile here instead of silently going stale.
 */
export const prismicDocumentType = {
	HOME_PAGE: 'home_page',
	PROJECT_PAGE: 'project',
	ARCHIVE_PAGE: 'archive',
	ABOUT_PAGE: 'about',
	SETTINGS: 'settings',
	MENU: 'menu',
} as const satisfies Record<string, PrismicDocumentType>

export const prismicDocumentRoutes = [
	{
		name: 'index',
		type: prismicDocumentType.HOME_PAGE,
		path: '/:lang?',
		alias: ['/:lang?/projets', '/:lang?/projects'],
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

/** Lookup par nom de route (sans collision, contrairement à un lookup par type — plusieurs routes peuvent partager le même type). */
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

export function isPrismicDocumentRoute(route: object) {
	const type = 'type' in route && typeof route.type === 'string' && route.type
	const hasPath = 'path' in route && typeof route.path === 'string' && route.path

	return hasPath && prismicDocumentRoutes.some(r => r.type === type)
}

/** Routable page types — derived from prismicDocumentRoutes, not hand-listed. */
export type PrismicDocumentPageType = PrismicDocumentRoute['type']

/** A document type is "dynamic" (repeatable, fetched by uid) when at least one of its routes carries a `:uid` param — adding a new repeatable type only requires registering its route above. */
export function isDynamicDocument(type: PrismicDocumentType) {
	return prismicDocumentRoutes.some(route => route.type === type && route.path.includes(':uid'))
}
