import type { ExtractDocumentType } from '~/types/api'
import { prismicDocumentRoutes } from '~~/shared/prismic-routes'
import type { ProjectDocument } from '~~/prismicio-types'
import { generateHashFromObject } from '~/utils/hash'
import type { PrismicDocument } from '@prismicio/types'

type PrismicClient = ReturnType<typeof usePrismic>['client']
export type GetAllByTypeParams = Parameters<PrismicClient['getAllByType']>[1]

export type RepeatableDocument = ProjectDocument
export type RepeatableDocumentType = ExtractDocumentType<ProjectDocument>

export function usePrismicFetchDocuments<T extends PrismicDocument = RepeatableDocument>(
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

    // TODO: use getByType to get paginated data
    return useAsyncData(key, () => {
        return prismicClient.getAllByType<T>(prismicDocument, options)
    }, {
        getCachedData: (key, nuxtApp) => nuxtApp.static.data[key] ?? nuxtApp.payload.data[key],
        dedupe: 'defer', // wait for the first request to finish before making another request
        deep: false,
        // lazy: true,
        // default: () => {
        //     return {
        //         page: options.page || 0,
        //         results_per_page: 0,
        //         results_size: 0,
        //         total_results_size: size,
        //         total_pages: 0,
        //         next_page: null,
        //         prev_page: null,
        //         results: [...Array(size).keys()].map(() => null),
        //     }
        // },
    })
}
