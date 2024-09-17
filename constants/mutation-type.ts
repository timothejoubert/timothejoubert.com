enum MutationType {
    // Prismic
    SET_COMMON_CONTENT = 'setCommonContent',
    CURRENT_PAGE_DATA = 'setCurrentPageData',

    // App
    SPLASH_SCREEN_DONE = 'splashScreenDone',
    SETTING_OPENED = 'settingOpened',
    ABOUT_OPENED = 'aboutOpened',
    IS_PROJECT_EXPANDED = 'isProjectExpanded',
    IS_EVERY_PROJECT_IN_FAVORITE = 'isEveryProjectInFavorite',
    PROJECT_QUEUE_LIST = 'projectQueueList',

    // UI settings
    FRAMEWORK_FILTERS = 'frameworkFilters',
    TAG_FILTERS = 'tagFilters',
    UI_THEME = 'uiTheme',
    UI_COLUMNS = 'uiColumns',
    ALL_PROJECT_DISPLAYED = 'allProjectDisplayed',

    // Global
    FIRST_PAGE_ERROR = 'firstPageError',
    ERROR_PAGE = 'errorPage',
    WINDOW_WIDTH = 'windowWidth',
    WINDOW_HEIGHT = 'windowHeight',
    PREFERS_REDUCED_MOTION = 'prefersReducedMotion',
    SCROLL_IS_DISABLED = 'scrollIsDisabled',
}

export default MutationType
