import { NuxtError } from '@nuxt/types'
import { PrismicDocument } from '@prismicio/types/src/value/document'
import * as prismicT from '@prismicio/types'
import { ProjectDocument, SettingsDocument } from '~~/prismicio-types'

interface RootState {
    // Prismic data
    settings: SettingsDocument | null
    // mainMenu: MainMenuDocument | null
    projects: ProjectDocument[] | null
    currentPageData: PrismicDocument | null

    // components
    splashScreenDone: Boolean
    mediaViewerData: null | prismicT.ImageField[]
    mediaViewerSlideIndex: number

    // Global
    windowWidth: number
    windowHeight: number
    errorPage: NuxtError | null
    prefersReducedMotion: boolean
    scrollIsDisabled: boolean
}
