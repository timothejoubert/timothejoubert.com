import type { ProjectDocument } from '~~/prismicio-types'
import { getRoutePath, type PrismicRouteName } from '~~/shared/prismic-routes'

interface ProjectNeighbor {
	title: ProjectDocument['data']['title']
	path: string
}

/** Previous/next project within the same listing (home "favorite" or archive), wrapping around at both ends. */
export function useProjectNeighbors(document: ProjectDocument) {
	const isFavorite = !!document.data.favorite
	const routeName: PrismicRouteName = isFavorite ? 'projet' : 'projet-archive'

	const { data: projects } = usePrismicFetchProjects(isFavorite)

	function toNeighbor(project?: ProjectDocument): ProjectNeighbor | undefined {
		if (!project) return undefined
		return { title: project.data.title, path: getRoutePath(routeName, { uid: project.uid }) }
	}

	const currentIndex = computed(() => projects.value?.findIndex(project => project.uid === document.uid) ?? -1)

	const prevProject = computed(() => {
		const list = projects.value
		if (!list || list.length < 2 || currentIndex.value === -1) return undefined
		return toNeighbor(list[(currentIndex.value - 1 + list.length) % list.length])
	})

	const nextProject = computed(() => {
		const list = projects.value
		if (!list || list.length < 2 || currentIndex.value === -1) return undefined
		return toNeighbor(list[(currentIndex.value + 1) % list.length])
	})

	return { prevProject, nextProject }
}
