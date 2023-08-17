import { RTNode } from '@prismicio/types/src/value/richText'
import { ProjectDocument, SettingsDocument } from '~~/prismicio-types'

type Theme = 'light' | 'dark' | 'accent'
type ThemeKey = 'foreground' | 'background' | 'accent'

type CommonContentKey = keyof CommonContent

interface CommonContent {
    settings?: SettingsDocument
    projects?: ProjectDocument[]
}

type PrismicRichText = RTNode[] | RTNode[][]

interface ClientTheme {
    foreground: string
    accent: string
    background: string
}
