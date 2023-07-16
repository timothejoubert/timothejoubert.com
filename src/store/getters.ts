import type { GetterTree } from 'vuex'
import { RootState } from '~/types/store'
import { ProjectDocument, ProjectFrameworkDocument, ProjectTagDocument, SettingsDocument } from '~~/prismicio-types'
import { CommonContentKey } from '~/types/app'
import { isHomePageDocument } from '~/utils/prismic/document-entity'
import CustomType from '~/constants/custom-type'

export const getters: GetterTree<RootState, RootState> = {
    isHomePage(state: RootState) {
        return isHomePageDocument(state.currentPageData)
    },
    commonContentData(state: RootState) {
        return function (key: CommonContentKey) {
            return state.commonContent?.[key]
        }
    },
    settings(_state: RootState, getters: any): SettingsDocument {
        return getters.commonContentData('settings')
    },
    projects(_state: RootState, getters: any): ProjectDocument[] {
        return getters.commonContentData('projects')
    },
    projectTags(_state: RootState, getters: any): ProjectTagDocument[] {
        return getters.commonContentData('projectTags')
    },
    projectFrameworks(_state: RootState, getters: any): ProjectFrameworkDocument[] {
        return getters.commonContentData('projectFrameWorks')
    },
    getFramework: (_state: RootState, getters: any) => {
        return (uid: string | undefined): ProjectDocument | undefined =>
            getters.projectFrameworks?.find((framework: ProjectFrameworkDocument) => framework.uid === uid)?.data?.name
    },
    isProjectUid: (_state: RootState, getters: any) => {
        return (uid: string): boolean => !!getters.projects?.some((project: ProjectDocument) => project.uid === uid)
    },
    getProjectByUid: (_state: RootState, getters: any) => {
        return (uid: string): ProjectDocument | undefined =>
            getters.projects?.find((project: ProjectDocument) => project.uid === uid)
    },
    isProjectOpen(state: RootState): boolean {
        return state.currentPageData?.type === CustomType.PROJECT
    },
}

export default getters
