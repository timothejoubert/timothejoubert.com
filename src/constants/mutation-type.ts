enum MutationType {
    // Prismic
    SET_MAIN_MENU = 'setMainMenu',
    SET_SETTINGS = 'setSettings',
    SET_PROJECTS = 'setProjects',
    CURRENT_PAGE_DATA = 'setCurrentPageData',

    // loading
    SPLASH_SCREEN_DONE = 'splashScreenDone',

    // Global
    WINDOW_WIDTH = 'windowWidth',
    WINDOW_HEIGHT = 'windowHeight',
    ERROR_PAGE = 'errorPage',
    PREFERS_REDUCED_MOTION = 'prefersReducedMotion',
    SCROLL_IS_DISABLED = 'scrollIsDisabled',
    MEDIA_VIEWER_DATA = 'mediaViewerData',
    MEDIA_VIEWER_SLIDE_INDEX = 'mediaViewerSlideIndex',
}

export default MutationType
