enum MutationType {
    // Prismic
    SET_COMMON_CONTENT = 'setCommonContent',
    CURRENT_PAGE_DATA = 'setCurrentPageData',

    // loading
    SPLASH_SCREEN_DONE = 'splashScreenDone',
    TOGGLE_SETTINGS = 'isSettingsOpen',

    // Global
    ERROR_PAGE = 'errorPage',
    WINDOW_WIDTH = 'windowWidth',
    WINDOW_HEIGHT = 'windowHeight',
    PREFERS_REDUCED_MOTION = 'prefersReducedMotion',
    SCROLL_IS_DISABLED = 'scrollIsDisabled',
}

export default MutationType
