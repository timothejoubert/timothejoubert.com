import { PrismicDocumentType } from '~/constants/prismic-document-type'

export function isExistingDocumentType(type: string) {
    return !!Object.values(PrismicDocumentType).find(existingType => existingType === type)
}

export function isProjectDocument(type: string) {
    return type === PrismicDocumentType.PROJECT
}

export function isDynamicDocument(prismicDocument: string) {
    return isProjectDocument(prismicDocument)
}
