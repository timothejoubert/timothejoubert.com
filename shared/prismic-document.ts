import { prismicDocumentRoutes } from '~~/shared/prismic-routes'

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

export function isExistingDocumentType(type: string) {
	return !!prismicDocumentRoutes.find(route => route.type === type)
}

export function isHomeDocument(type: string) {
	return type === prismicDocumentType.HOME_PAGE
}

export function isAboutDocument(type: string) {
	return type === prismicDocumentType.ABOUT_PAGE
}

export function isArchiveDocument(type: string) {
	return type === prismicDocumentType.ARCHIVE_PAGE
}

export function isProjectListingDocument(type: string) {
	return type === prismicDocumentType.PROJECT_LISTING_PAGE
}

export function isProjectDocument(type: string) {
	return type === prismicDocumentType.PROJECT_PAGE
}

export function isDynamicDocument(type: PrismicDocumentType) {
	return isProjectDocument(type)
}
