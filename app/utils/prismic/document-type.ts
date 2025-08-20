import type { PrismicDocumentType } from '~/types/api'
import { prismicDocumentRoutes, prismicDocumentName } from '~~/shared/prismic-routes'

export function isExistingDocumentType(type: string) {
	return !!prismicDocumentRoutes.find(route => route.type === type)
}

export function isHomeDocument(type: string) {
	return type === prismicDocumentName.home_page
}

export function isAboutDocument(type: string) {
	return type === prismicDocumentName.about
}

export function isArchiveDocument(type: string) {
	return type === prismicDocumentName.archive
}

export function isProjectDocument(type: string) {
	return type === prismicDocumentName.project
}

export function isProjectListingDocument(type: string) {
	return type === prismicDocumentName.project_listing_page
}

export function isDynamicDocument(type: PrismicDocumentType) {
	return isProjectDocument(type)
}
