import { FilledContentRelationshipField } from '@prismicio/types/src/value/contentRelationship'
import { PrismicDocument } from '@prismicio/types/src/value/document'
import DocumentUid from '~/constants/document-uid'

type PrismicDocumentKey = {
    id?: string
    type?: string
    href?: string
    data?: any
    link_type?: string
    uid?: string | null
}

type PrismicLinkKey = {
    id?: string
    type?: string
    link_type?: string
    href?: string
    uid?: string
    data?: any
    isBroken?: boolean
}

export const hasType = (document: unknown & { type?: string | null }): document is { type: string } => {
    return !!document?.type
}

export const hasUid = (document: unknown & { uid?: string | null }): document is { uid: string } => {
    return !!document?.uid
}

export const isPrismicDocument = (document: unknown & PrismicDocumentKey): document is PrismicDocument => {
    return 'id' in document && 'type' in document && 'href' in document && 'data' in document
}

export const isDocumentLink = (document: any & PrismicLinkKey): document is FilledContentRelationshipField => {
    return 'id' in document && 'type' in document && 'link_type' in document && 'uid' in document && !document.isBroken
}

export const isValidUidConst = (value: string): value is DocumentUid => {
    return Object.values<string>(DocumentUid).includes(value)
}

// export const isOnlyPages = (documents: Document[]): documents is PageDocument[] => {
//     return documents.every(document => isPageDocument(document))
// }
//
// export const isProjectDocument = (document: Document): document is ProjectDocument => {
//     return document.type === 'project'
// }
