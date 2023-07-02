import type { ActionTree, ActionContext } from 'vuex'
import { Context } from '@nuxt/types'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import type { BodyScrollOptions } from 'body-scroll-lock'
import { PrismicDocument } from '@prismicio/types/src/value/document'
import { Document } from '@prismicio/client/types/documents'
import ApiSearchResponse from '@prismicio/client/types/ApiSearchResponse'
import { RootState } from '~/types/store'
import MutationType from '~/constants/mutation-type'
import { CustomTypeName } from '~/types/prismic/app-prismic'
import CustomType from '~/constants/custom-type'
import { ProjectDocument, ProjectFrameworkDocument, ProjectTagDocument } from '~~/prismicio-types'
import { getNumberedDate } from '~/utils/prismic/date'

type CommonContentResponse = (Document | ApiSearchResponse<ProjectTagDocument | ProjectFrameworkDocument>)[]

const actions: ActionTree<RootState, RootState> = {
    async nuxtServerInit({ commit, dispatch }: ActionContext<RootState, RootState>, context: Context) {
        if (context.route.fullPath.includes('/en')) await context.app.i18n.setLocale('en')
        else await context.app.i18n.setLocale('fr')

        await dispatch('getCommonContent', context)
            .then(([settings, frameworks, tags]: Array<CommonContentResponse>) => {
                // commit(MutationType.SET_MAIN_MENU, mainMenu)
                commit(MutationType.SET_SETTINGS, settings)
                commit(
                    MutationType.SET_FRAMEWORKS,
                    (frameworks as unknown as ApiSearchResponse<ProjectFrameworkDocument>).results
                )
                commit(MutationType.SET_TAGS, (tags as unknown as ApiSearchResponse<ProjectTagDocument>).results)
            })
            .catch((fetchError: Error) => {
                throw new Error(`failed to fetch mainMenu or setting: ${fetchError}`)
            })

        await dispatch('getProjects', context)
            .then((projects: Array<ProjectDocument>) => {
                const projectOrdered = projects.sort(
                    (accumulator: ProjectDocument, current: ProjectDocument) =>
                        getNumberedDate(current.data.date) - getNumberedDate(accumulator.data.date)
                )
                commit(MutationType.SET_PROJECTS, projectOrdered)
            })
            .catch((fetchError: Error) => {
                throw new Error(`failed to fetch projects: ${fetchError}`)
            })
    },
    getCommonContent(
        _actionContext: ActionContext<RootState, RootState>,
        context: Context
    ): Promise<CommonContentResponse> {
        const localeOptions = context.route.fullPath.includes('/en') ? { lang: 'en-gb' } : undefined

        // const mainMenu = context.$prismic.api.getSingle(CustomType.MAIN_MENU as CustomTypeName, localeOptions)
        const settings = context.$prismic.api.getSingle(CustomType.SETTINGS as CustomTypeName, localeOptions)
        const frameworks = context.$prismic.api.query(
            context.$prismic.predicates.at('document.type', CustomType.PROJECT_FRAMEWORK as CustomTypeName)
        )
        const tags = context.$prismic.api.query(
            context.$prismic.predicates.at('document.type', CustomType.PROJECT_TAG as CustomTypeName)
        )
        // const frameworks = context.$prismic.api.getSingle(CustomType.PROJECT_FRAMEWORK as CustomTypeName, localeOptions)
        // const tags = context.$prismic.api.getSingle(CustomType.PROJECT_TAG as CustomTypeName, localeOptions)

        return Promise.all([settings, frameworks, tags])
    },
    getProjects(
        _actionContext: ActionContext<RootState, RootState>,
        context: Context
    ): Promise<Document<ProjectDocument>[]> {
        const localeOptions = context.route.fullPath.includes('/en') ? { lang: 'en-gb' } : undefined

        const projects = context.$prismic.api
            .query(context.$prismic.predicates.at('document.type', CustomType.PROJECT as CustomTypeName), localeOptions)
            .then((response) => response.results)

        return Promise.resolve(projects)
    },
    updatePageData({ commit }: ActionContext<RootState, RootState>, data: PrismicDocument) {
        commit(MutationType.CURRENT_PAGE_DATA, data)
    },
    disableScroll(
        { commit }: ActionContext<RootState, RootState>,
        { element, options }: { element: HTMLElement; options?: BodyScrollOptions }
    ) {
        disableBodyScroll(element, { reserveScrollBarGap: true, ...options })

        commit(MutationType.SCROLL_IS_DISABLED, true)
    },
    enableScroll({ commit }: ActionContext<RootState, RootState>, { element }: { element: HTMLElement }) {
        enableBodyScroll(element)

        commit(MutationType.SCROLL_IS_DISABLED, false)
    },
}

export default actions
