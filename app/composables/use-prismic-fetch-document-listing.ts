import type { ExtractDocumentType } from '~/types/api'
import { prismicDocumentRoutes } from '~~/shared/prismic-routes'
import type { ProjectDocument } from '~~/prismicio-types'
import { generateHashFromObject } from '~/utils/hash'

type PrismicClient = ReturnType<typeof usePrismic>['client']
export type GetAllByTypeParams = Parameters<PrismicClient['getAllByType']>[1]

export type RepeatableDocument = ProjectDocument
export type RepeatableDocumentType = ExtractDocumentType<ProjectDocument>

export function usePrismicFetchDocuments(
	prismicDocument: RepeatableDocumentType, options: GetAllByTypeParams = {},
) {
	const prismicClient = usePrismic().client
	const fetchOptions = {
		// pageSize: options.pageSize || 12, // default 20
		limit: options.pageSize || 2, // default 20
		routes: prismicDocumentRoutes,
		brokenRoute: '/404',
		...useLocale()?.fetchLocaleOption.value,
		...options,
	}

	const hash: string[] = [prismicDocument]
	if (Object.keys(fetchOptions).length) hash.push(generateHashFromObject(fetchOptions))

	const key = `documents-${hash.join('-')}`

	return useAsyncData(key, () => {
		return prismicClient.getAllByType(prismicDocument, options)
	}, {
		lazy: false,
	})
}
