import { RootState } from '~/types/store'
import { getObjectFormattedTheme } from '~/utils/get-theme'

export default (): RootState => ({
    // Prismic data
    commonContent: {},
    currentPageData: null,

    // App
    splashScreenDone: false,
    isSettingsOpen: false,
    isAboutOpen: false,
    clientTheme: getObjectFormattedTheme(),

    // project filters
    tagFilters: [],
    frameWorkFilters: [],

    // General
    errorPage: null,
    windowWidth: 0,
    windowHeight: 0,
    prefersReducedMotion: false,
    scrollIsDisabled: false,
})
