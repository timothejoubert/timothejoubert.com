import { usePrismic } from '@prismicio/vue'
import type { BuildQueryURLArgs } from '@prismicio/client/dist/buildQueryURL'
import type { FetchParams } from '@prismicio/client/dist/BaseClient'
import type { PrismicDocumentType } from '~/types/api'
import { prismicDocumentRouteList } from '~/utils/prismic/route-resolver'

// Rename DocumentType to PrismicDocumentType
type PrismicFetchDocumentsOptions = Partial<BuildQueryURLArgs> & FetchParams

export function usePrismicFetchDocuments(prismicDocument: PrismicDocumentType, options: PrismicFetchDocumentsOptions = {}) {
    const key = `fetched-pages-${prismicDocument}`
    const cachedData = useNuxtData(key)

    return cachedData.data.value
        ? cachedData
        : useAsyncData(key, async () => {
            const prismicClient = usePrismic().client
            const { fetchLocaleOption } = useLocale()

            return await prismicClient.getByType(prismicDocument, {
                ...fetchLocaleOption.value,
                pageSize: 10,
                routes: prismicDocumentRouteList,
                ...options,
            })
        }, {
            deep: false,
            default: () => [],
        })
}
