import type { GetAllByTypeParams } from '~/composables/use-prismic-fetch-document-listing'
import { prismicDocumentType } from '~~/shared/prismic-document'

export function usePrismicFetchProjects(isFavorite = true, options: GetAllByTypeParams = {}) {
	const { $prismic } = useNuxtApp()
	const prismicFilter = $prismic.filter

	return usePrismicFetchDocuments(prismicDocumentType.PROJECT_PAGE, {
		orderings: [
			{
				field: 'my.project.order_date',
				direction: 'desc',
			},
			{
				field: 'my.project.creation_date',
				direction: 'desc',
			},
		],
		filters: [prismicFilter.at('my.project.favorite', isFavorite)],
		...options,
	})
}
