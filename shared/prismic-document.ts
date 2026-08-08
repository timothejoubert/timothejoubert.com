import { prismicDocumentRoutes } from './prismic-routes'

export const prismicDocumentCustomType = {
	SETTINGS: 'settings',
	MENU: 'menu',
} as const

const prismicDocumentPage = {
	HOME_PAGE: 'home_page',
	PROJECT_PAGE: 'project',
	PROJECT_LISTING_PAGE: 'project_listing_page',
	ARCHIVE_PAGE: 'archive',
	ABOUT_PAGE: 'about',
	// DEFAULT_PAGE: 'page',
} as const

export const prismicDocumentType = {
	...prismicDocumentPage,
	...prismicDocumentCustomType,
} as const

export type PrismicDocumentPageType = typeof prismicDocumentPage[keyof typeof prismicDocumentPage]
export type PrismicDocumentType = typeof prismicDocumentType[keyof typeof prismicDocumentType]

/** A document type is "dynamic" (repeatable, fetched by uid) when at least one of its routes carries a `:uid` param — adding a new repeatable type only requires registering its route in `prismicDocumentRoutes`. */
export function isDynamicDocument(type: PrismicDocumentType) {
	return prismicDocumentRoutes.some(route => route.type === type && route.path.includes(':uid'))
}
