import { usePrismic } from '@prismicio/vue'
import type { DocumentType } from '~/types/api'

// Rename DocumentType to PrismicDocumentType
export function usePrismicFetchDocuments(prismicDocument: DocumentType, options: Record<string, unknown> = {}) {
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
                ...options,
            })
        }, {
            deep: false,
            default: () => [],
        })
}
