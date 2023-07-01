import { CustomTypeName } from '~/types/prismic/app-prismic'
import { hasType } from '~/types/prismic/prismic-guard'

export function isEntityType(document: unknown & { type: string }, type: CustomTypeName): boolean {
    return hasType(document) && document?.type === type
}

export const isSettings = (document: unknown & { type: string }): boolean => {
    return isEntityType(document, 'settings')
}

export const isPage = (document?: unknown & { type: string }): boolean => {
    return !!document && isEntityType(document, 'page')
}

export const isProjectDocument = (document: unknown & { type: string }): boolean => {
    return isEntityType(document, 'project')
}

export const isDefaultPageDocument = (document: unknown & { type: string }): boolean => {
    return isEntityType(document, 'page')
}

// export const isMainMenu = (document: unknown & { type: string }): boolean => {
//     return isEntityType(document, 'main_menu')
// }
