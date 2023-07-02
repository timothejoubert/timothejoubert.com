import { RootState } from '~/types/store'

export default (): RootState => ({
    // Prismic data
    settings: null,
    // mainMenu: null,
    projects: null,
    projectTags: [],
    projectFramework: [],
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
