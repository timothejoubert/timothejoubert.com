import type { ActionTree, ActionContext } from 'vuex'
import { Context, NuxtError } from '@nuxt/types'
import { PrismicDocument } from '@prismicio/types/src/value/document'
import { Document } from '@prismicio/client/types/documents'
import { RootState } from '~/types/store'
import MutationType from '~/constants/mutation-type'
import { CustomTypeName } from '~/types/prismic/app-prismic'
import CustomType from '~/constants/custom-type'
import { ProjectDocument, SettingsDocument } from '~~/prismicio-types'

type CommonContentResponse = (Document<SettingsDocument> | Document<ProjectDocument>[])[]

const actions: ActionTree<RootState, RootState> = {
    async nuxtServerInit({ commit, dispatch }: ActionContext<RootState, RootState>, context: Context) {
        await dispatch('getCommonContent', context)
            .then(([settings, projects]: Array<CommonContentResponse>) => {
                const displayAllProjects = (settings as unknown as SettingsDocument)?.data?.display_all_projects

                commit(MutationType.SET_COMMON_CONTENT, {
                    settings,
                    projects: displayAllProjects
                        ? projects
                        : (projects as unknown as ProjectDocument[]).filter((project) => project.data.favorite),
                })
            })
            .catch((requestError: Error) => {
                commit(MutationType.FIRST_PAGE_ERROR, {
                    statusCode: 500,
                    message: requestError?.message,
                } as NuxtError)

                throw new Error(`failed to fetch mainMenu or setting: ${requestError}`)
            })
    },
    getCommonContent(
        _actionContext: ActionContext<RootState, RootState>,
        context: Context
    ): Promise<CommonContentResponse> {
        const localeOptions = context.route.fullPath.includes('/en') ? { lang: 'en-gb' } : undefined

        // const mainMenu = context.$prismic.api.getSingle(CustomType.MAIN_MENU as CustomTypeName, localeOptions)
        const settings = context.$prismic.api.getSingle(CustomType.SETTINGS as CustomTypeName, localeOptions)

        // https://prismic.io/docs/rest-api-technical-reference
        // https://prismic.io/docs/technical-reference/prismicio-client?version=v5#predicates
        // TODO try to fetch only project with `my.project.display_only_favorite` that is true
        const projects = context.$prismic.api
            .query(context.$prismic.predicates.at('document.type', CustomType.PROJECT as CustomTypeName), {
                orderings: '[my.project.date desc]',
                pageSize: 100, // default 20
                ...localeOptions,
            })
            .then((response) => response.results)

        return Promise.all([settings, projects])
    },
    updatePageData({ commit }: ActionContext<RootState, RootState>, data: PrismicDocument) {
        commit(MutationType.CURRENT_PAGE_DATA, data)
    },
}

export default actions
