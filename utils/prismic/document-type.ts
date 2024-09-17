import { DocumentType } from '~/constants/document-type'

export function isExistingDocumentType(type: string) {
    return !!Object.values(DocumentType).find(existingType => existingType === type)
}

export function isErrorDocument(type: string) {
    return type === DocumentType.ERROR_PAGE
}

export function isWebPageDocument(type: string) {
    return type === DocumentType.WEB_PAGE
}

export function isProjectDocument(type: string) {
    return type === DocumentType.PROJECT
}

export function isDynamicDocument(prismicDocument: string) {
    return isWebPageDocument(prismicDocument) || isProjectDocument(prismicDocument)
}
