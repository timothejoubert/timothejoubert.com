import type { GetterTree } from 'vuex'
import { RootState } from '~/types/store'
import { ProjectDocument, SettingsDocument } from '~~/prismicio-types'
import { CommonContentKey } from '~/types/app'
import { isHomePageDocument } from '~/utils/prismic/document-entity'
import CustomType from '~/constants/custom-type'

export const getters: GetterTree<RootState, RootState> = {
    // APP
    isHomePage(state: RootState) {
        return isHomePageDocument(state.currentPageData)
    },
    getCommonContentData(state: RootState) {
        return (key: CommonContentKey) => state.commonContent?.[key]
    },
    settings(_state: RootState, getters: any): SettingsDocument {
        return getters.getCommonContentData('settings')
    },
    isProjectOpen(state: RootState): boolean {
        return state.currentPageData?.type === CustomType.PROJECT
    },
    // PROJECTS
    projects(_state: RootState, getters: any): ProjectDocument[] {
        return getters.getCommonContentData('projects')
    },
    highlightedProjects(_state: RootState, getters: any): ProjectDocument[] {
        return getters.projects?.filter((project: ProjectDocument) => project.data.favorite) || []
    },
    isProjectUid: (_state: RootState, getters: any) => {
        return (uid: string): boolean => !!getters.projects?.some((project: ProjectDocument) => project.uid === uid)
    },
    getProjectByUid: (_state: RootState, getters: any) => {
        return (uid: string): ProjectDocument | undefined =>
            getters.projects?.find((project: ProjectDocument) => project.uid === uid)
    },
    getProjectUidInQueue(state: RootState, getters: any) {
        return (position: 'previous' | 'next'): string => {
            const currentUid = state.currentPageData?.uid
            const list = (state.projectQueueList as string[]) || getters.projects.map((p: ProjectDocument) => p.uid)
            const currentIndex = list.findIndex((uid) => uid === currentUid)

            let nextProjectIndex = 0
            if (position === 'next' && currentIndex !== list.length - 1) nextProjectIndex = currentIndex + 1
            else if (position === 'previous') {
                nextProjectIndex = currentIndex === 0 ? list.length - 1 : currentIndex - 1
            }

            return list[nextProjectIndex]
        }
    },
    getNextProjectInQueue(_state: RootState, getters: any): ProjectDocument {
        const nextProjectUid = getters.getProjectUidInQueue('next')
        return getters.getProjectByUid(nextProjectUid)
    },
}

export default getters
