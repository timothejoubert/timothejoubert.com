import type { GetterTree } from 'vuex'
import { RootState } from '~/types/store'
import { ProjectDocument } from '~~/prismicio-types'

export const getters: GetterTree<RootState, RootState> = {
    // alreadyVisited: (state: RootState) => state.alreadyVisited,
    getProjectByUid: (state: RootState) => {
        return (uid: string): ProjectDocument | undefined => state.projects?.find((project) => project.uid === uid)
    },
    isProjectUid: (state: RootState) => {
        return (uid: string): boolean => !!state.projects?.some((project) => project.uid === uid)
    },
}

export default getters
