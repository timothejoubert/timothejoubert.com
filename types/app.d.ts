import type { PrismicDocument } from '@prismicio/types'
import type { PrismicDocumentType } from '~/constants/prismic-document-type'

export type Theme = 'dark' | 'light'

export interface PageProps<T extends PrismicDocument> {
    prismicDocument: T
    type: PrismicDocumentType
}
