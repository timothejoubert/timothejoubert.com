import { NuxtError } from '@nuxt/types'
import { PrismicDocument } from '@prismicio/types/src/value/document'
import { ClientTheme, CommonContent } from '~/types/app'

interface RootState {
    // Prismic data
    commonContent: CommonContent
    currentPageData: PrismicDocument | null

    // App
    isSettingsOpen: boolean
    splashScreenDone: boolean
    isAboutOpen: boolean
    isProjectExpanded: boolean
    isEveryProjectInFavorite: boolean

    // UI setting
    uiTheme: ClientTheme
    uiColumns: string
    tagFilters: string[]
    frameWorkFilters: string[]
    allProjectDisplayed: boolean

    // Global
    firstPageError: NuxtError | null
    windowWidth: number
    windowHeight: number
    errorPage: NuxtError | null
    prefersReducedMotion: boolean
    scrollIsDisabled: boolean
}
