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
    clientTheme: ClientTheme

    // project filters
    tagFilters: string[]
    frameWorkFilters: string[]

    // Global
    windowWidth: number
    windowHeight: number
    errorPage: NuxtError | null
    prefersReducedMotion: boolean
    scrollIsDisabled: boolean
}
