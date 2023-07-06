import { NuxtError } from '@nuxt/types'
import { PrismicDocument } from '@prismicio/types/src/value/document'
import * as prismicT from '@prismicio/types'
import { CommonContent } from '~/types/app'

interface RootState {
    // Prismic data
    commonContent: CommonContent
    currentPageData: PrismicDocument | null

    // App
    isSettingsOpen: boolean

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
