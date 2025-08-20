// https://prismic.io/docs/route-resolver#resolvers
// https://prismic.io/docs/nuxt-3-define-routes
import { extractValueBetweenOccurrence } from '~/utils/string/extract'
import { I18N_LOCALES } from '~~/i18n/i18n'
import type { PrismicDocumentType } from '~/types/api'
import { prismicDocumentRoutes, type PrismicDocumentRoute } from '~~/shared/prismic-routes'

export function isPrismicDocumentRoute(route: object): route is PrismicDocumentRoute {
	if (!('type' in route) || !('path' in route)) return false

	const routeTypeList = prismicDocumentRoutes.map(r => r.type) as string []
	return routeTypeList.includes(route.type as string)
}

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

// TODO: find item by alias too
export function getDocumentTypeByUrl(path: string) {
	const firstSegment = extractValueBetweenOccurrence(path, '/', [1, 2]) || ''

	const route = prismicDocumentRoutes.find((prismicRoute) => {
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

	return undefined
}

export function getDocumentRoutePath(documentType: PrismicDocumentType) {
	const currentRoute = prismicDocumentRoutes.find(route => route.type === documentType)

	return currentRoute?.path?.replace('/:lang?', '').replace(':uid', '')
}
