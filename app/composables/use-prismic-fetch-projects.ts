import { filter } from '@prismicio/client'
import type { GetAllByTypeParams } from '~/composables/use-prismic-fetch-document-listing'
import { prismicDocumentType } from '~~/shared/prismic-schema'

export function usePrismicFetchProjects(isFavorite = true, options: GetAllByTypeParams = {}) {
	return usePrismicFetchDocumentListing(prismicDocumentType.PROJECT_PAGE, {
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
		filters: [filter.at('my.project.favorite', isFavorite)],
		...options,
	})
}
