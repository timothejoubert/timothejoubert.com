import { RootState } from '~/types/store'
import { getObjectFormattedTheme } from '~/utils/theme'
import AppConst from '~/constants/app'
import toBoolean from '~/utils/to-boolean'

export default (): RootState => ({
    // Prismic data
    commonContent: {},
    currentPageData: null,

    // App
    splashScreenDone: false,
    isSettingsOpen: false,
    isAboutOpen: false,
    isProjectExpanded: false,
    isEveryProjectInFavorite: false,
    projectQueueList: null,

    // UI setting
    uiTheme: getObjectFormattedTheme(),
    uiColumns: AppConst.UI_COLUMNS,
    tagFilters: [],
    frameWorkFilters: [],
    allProjectDisplayed: toBoolean(AppConst.ALL_PROJECT_DISPLAYED),

    // General
    firstPageError: null,
    errorPage: null,
    windowWidth: 0,
    windowHeight: 0,
    prefersReducedMotion: false,
    scrollIsDisabled: false,
})
