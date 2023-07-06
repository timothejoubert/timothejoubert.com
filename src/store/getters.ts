import type { GetterTree } from 'vuex'
import { RootState } from '~/types/store'
import { ProjectDocument, ProjectFrameworkDocument, ProjectTagDocument } from '~~/prismicio-types'
import { CommonContentKey } from '~/types/app'

export const getters: GetterTree<RootState, RootState> = {
    commonContentData(state: RootState) {
        return function (key: CommonContentKey) {
            return state.commonContent?.[key]
        }
    },
    settings(_state: RootState, getters: any): ProjectDocument[] {
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
    isProjectUid: (_state: RootState, getters: any) => {
        return (uid: string): boolean => !!getters.projects?.some((project: ProjectDocument) => project.uid === uid)
    },
    getProjectByUid: (_state: RootState, getters: any) => {
        return (uid: string): ProjectDocument | undefined =>
            getters.projects?.find((project: ProjectDocument) => project.uid === uid)
    },
}

export default getters
