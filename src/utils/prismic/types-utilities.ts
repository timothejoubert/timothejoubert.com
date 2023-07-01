import { Document } from '@prismicio/client/types/documents'

export function getDocumentData<T>(document: Document): T {
    return !!document && document.data
}

