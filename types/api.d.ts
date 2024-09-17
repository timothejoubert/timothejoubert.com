import type { PrismicDocumentWithoutUID, PrismicDocument, PrismicDocumentWithUID } from '@prismicio/types'
import type { AllDocumentTypes, MenuDocument } from '~/prismicio-types'

// Document data
export type DocumentWithUid = IntersectDocument<AllDocumentTypes, PrismicDocumentWithUID>
export type DocumentWithoutUid = IntersectDocument<AllDocumentTypes, PrismicDocumentWithoutUID>
export type ReachableDocument = ExcludeDocument<AllDocumentTypes, (MenuDocument)> // ExcludeDocument<DocumentWithUid, MenuDocument> // PageDocument | ProjectDocument

// Document type
export type DocumentType = ExtractDocumentType<AllDocumentTypes>
export type DocumentWithUidType = ExtractDocumentType<DocumentWithUid>
export type DocumentWithoutUidType = ExtractDocumentType<IntersectDocument<AllDocumentTypes, PrismicDocumentWithoutUID>>
export type ReachableDocumentType = ExtractDocumentType<ReachableDocument>

// Page
export type VDocumentData = ReachableDocument['data']
export type VDocumentResponse<T extends AllDocumentTypes['data']> = { webResponse: PrismicDocument<T> }

//  UTILS
type ExtractDocumentType<T extends PrismicDocument> = Pick<T, 'type'>['type']
type IntersectDocument<T extends PrismicDocument, FilterType extends PrismicDocument> = T extends FilterType ? T : never
type ExcludeDocument<T extends PrismicDocument, FilterType extends PrismicDocument> = T extends FilterType ? never : T
