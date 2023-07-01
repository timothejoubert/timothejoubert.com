import type { PrismicDocument } from '@prismicio/types'
import { hasUid } from '~/types/prismic/prismic-guard'
import DocumentUid from '~/constants/document-uid'

export function isDocumentByUid(document: PrismicDocument, name: string): boolean {
    return hasUid(document) && document.uid === name
}

export const isHomePageDocument = (document?: PrismicDocument): boolean => {
    return isDocument(document) && isDocumentByUid(document, DocumentUid.HOME)
}

export const isProjectListingDocument = (document?: PrismicDocument): boolean => {
    return isDocument(document) && isDocumentByUid(document, DocumentUid.PROJECT_LISTING)
}

export const hasParentPage = (document: PrismicDocument): boolean => {
    return !!document.data?.parent?.uid || !!document.data?.parent?.slug
}

const isDocument = (document?: unknown & Partial<PrismicDocument>): document is PrismicDocument => {
    return (
        !!document &&
        'data' in document &&
        'id' in document &&
        'uid' in document &&
        'url' in document &&
        'type' in document &&
        'href' in document &&
        'slugs' in document &&
        'linked_documents' in document
    )
}
