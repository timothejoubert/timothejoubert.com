import { RootState } from '~/types/store'

export default (): RootState => ({
    // Prismic data
    commonContent: {},
    currentPageData: null,

    // SplashScreen
    splashScreenDone: false,

    // App
    isSettingsOpen: false,

    // General
    errorPage: null,
    windowWidth: 0,
    windowHeight: 0,
    prefersReducedMotion: false,
    scrollIsDisabled: false,
    mediaViewerData: null,
    mediaViewerSlideIndex: 0,
})
