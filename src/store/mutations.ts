import type { MutationTree } from 'vuex'
import { PrismicDocument } from '@prismicio/types/src/value/document'
import * as prismicT from '@prismicio/types'
import MutationType from '~/constants/mutation-type'
import { RootState } from '~/types/store'
import { MainMenuDocument, ProjectDocument, SettingsDocument } from '~~/prismicio-types'

export default {
    // Prismic
    [MutationType.SET_SETTINGS]: (state, settings: SettingsDocument) => (state.settings = settings),
    [MutationType.SET_MAIN_MENU]: (state, navigation: MainMenuDocument) => (state.mainMenu = navigation),
    [MutationType.SET_PROJECTS]: (state, value: ProjectDocument[]) => (state.projects = value),
    [MutationType.CURRENT_PAGE_DATA]: (state, value: PrismicDocument) => (state.currentPageData = value),

    // SplashScreen
    [MutationType.SPLASH_SCREEN_DONE]: (state, value: boolean) => (state.splashScreenDone = value),

    // Global
    [MutationType.WINDOW_WIDTH]: (state, value: number) => (state.windowWidth = value),
    [MutationType.WINDOW_HEIGHT]: (state, value: number) => (state.windowHeight = value),
    [MutationType.PREFERS_REDUCED_MOTION]: (state, navigation: boolean) => (state.prefersReducedMotion = navigation),
    [MutationType.SCROLL_IS_DISABLED]: (state, value: boolean) => (state.scrollIsDisabled = value),
    [MutationType.MEDIA_VIEWER_DATA]: (state, value: prismicT.ImageField[] | null) => (state.mediaViewerData = value),
    [MutationType.MEDIA_VIEWER_SLIDE_INDEX]: (state, value: number) => (state.mediaViewerSlideIndex = value),
} as MutationTree<RootState>
