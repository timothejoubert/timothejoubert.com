import type { MutationTree } from 'vuex'
import type { PrismicDocument } from '@prismicio/types'
import MutationType from '~/constants/mutation-type'
import { RootState } from '~/types/store'
import { ClientTheme, CommonContent } from '~/types/app'

export default {
    // Prismic
    [MutationType.SET_COMMON_CONTENT]: (state, value: CommonContent) => (state.commonContent = value),
    [MutationType.CURRENT_PAGE_DATA]: (state, value: PrismicDocument) => (state.currentPageData = value),

    // App
    [MutationType.SETTING_OPENED]: (state, value: boolean) => (state.isSettingsOpen = value),
    [MutationType.ABOUT_OPENED]: (state, value: boolean) => (state.isAboutOpen = value),
    [MutationType.SPLASH_SCREEN_DONE]: (state, value: boolean) => (state.splashScreenDone = value),
    [MutationType.TAG_FILTERS]: (state, value: string[]) => (state.tagFilters = value),
    [MutationType.CLIENT_THEME]: (state, color: { key: keyof ClientTheme; value: string }) => {
        return (state.clientTheme[color.key] = color.value)
    },

    // Global
    [MutationType.WINDOW_WIDTH]: (state, value: number) => (state.windowWidth = value),
    [MutationType.WINDOW_HEIGHT]: (state, value: number) => (state.windowHeight = value),
    [MutationType.PREFERS_REDUCED_MOTION]: (state, navigation: boolean) => (state.prefersReducedMotion = navigation),
    [MutationType.SCROLL_IS_DISABLED]: (state, value: boolean) => (state.scrollIsDisabled = value),
} as MutationTree<RootState>
