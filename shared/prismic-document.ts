import type { PrismicDocumentType } from '~/types/api'
import { prismicDocumentRoutes, prismicDocumentType } from '~~/shared/prismic-routes'

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
