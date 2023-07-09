import type { PrismicDocument } from '@prismicio/types'
import DocumentUid from '~/constants/document-uid'
import CustomType from '~/constants/custom-type'

export function isDocumentByCustomType(document: PrismicDocument | null, name: string): boolean {
    return !!document?.type && document.type === name
}

export function isDocumentByUid(document: PrismicDocument | null, name: string): boolean {
    return !!document?.uid && document.uid === name
}

export const isHomePageDocument = (document?: PrismicDocument | null): boolean => {
    return !!document && isDocumentByCustomType(document, CustomType.HOME_PAGE)
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
