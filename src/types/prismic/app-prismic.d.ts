// eslint-disable-next-line import/named
import { ImageField, PrismicDocumentWithoutUID } from '@prismicio/types'
import { PrismicDocument, PrismicDocumentWithUID } from '@prismicio/types/src/value/document'
import { LinkToMediaField } from '@prismicio/types/src/value/linkToMedia'
import { SettingsDocument, AllDocumentTypes, HomePageDocument, PageDocument, ProjectDocument } from '~~/prismicio-types'

// GLOBAL
export type CustomTypeName = extractDocumentType<AllDocumentTypes>
export type DocumentWithUid = extractDocument<AllDocumentTypes, PrismicDocumentWithUID>
export type DocumentWithUidNames = extractDocumentType<DocumentWithUid>
export type DocumentWithoutUidNames = extractDocumentType<extractDocument<AllDocumentTypes, PrismicDocumentWithoutUID>>
export type DocumentPageReachable = Exclude<DocumentWithUid, { type: 'project_framework' | 'project_tag' }>

export type DocumentWithUidData = DocumentWithUid['data']
export type DocumentPageReachableData = DocumentPageReachable['data']

// DATA
export type HomeDocumentData = HomePageDocument['data']
export type PageDocumentData = PageDocument['data']
export type ProjectDocumentData = ProjectDocument['data']
export type SettingsData = SettingsDocument['data']
// export type MainMenuData = MainMenuDocument['data']

//  UTILS
type extractDocumentType<T extends PrismicDocument> = Pick<T, 'type'>['type']
type extractDocument<T extends PrismicDocument, FilterType> = T extends FilterType ? T : never

// Field
export type PrismicMedia = ImageField | LinkToMediaField
