import type { PrismicDocument } from '@prismicio/types'
import type { DocumentType } from '~/types/api'
import { isDynamicDocument, isExistingDocumentType } from '~/utils/prismic/document-type'

export async function usePrismicFetchPage<T extends PrismicDocument>(prismicDocument: DocumentType) {
    const route = useRoute()
    const routeUid = route.params?.uid || ''

    const uid = Array.isArray(routeUid) ? routeUid.at(-1) : routeUid

    const key = `fetched-page-${prismicDocument}-${uid || 'unique'}`
    const cachedData = useNuxtData(key)

    const { data } = cachedData.data.value
        ? cachedData
        : await useAsyncData(key, async () => {
            const prismicClient = usePrismic().client
            const { fetchLocaleOption } = useLocale()
            const isDynamicUidDocument = uid && isDynamicDocument(prismicDocument)
            try {
                if (isDynamicUidDocument) {
                    return await prismicClient.getByUID(prismicDocument, uid, {
                        ...fetchLocaleOption.value,
                    })
                }
                else if (isExistingDocumentType(prismicDocument)) {
                    // prismicClient.get
                    return await prismicClient.getSingle(prismicDocument, {
                        ...fetchLocaleOption.value,
                        // fetchLinks: ['my.project.title', 'my.project.excerpt', 'my.project.main_media'],
                    })
                }
            }
            catch (error: unknown) {
                console.error(`PrismicError in useFetchPage on ${prismicDocument} `, error)
                // @ts-expect-error cannot know the error type
                return { error: createError(error) }
            }
        })

    const fetchResponse = data.value as T
    const locale = fetchResponse?.lang
    const pageData = fetchResponse?.data as T['data']
    const alternateLinks = fetchResponse?.alternate_languages || []

    return {
        prismicDocumentData: fetchResponse,
        alternateLinks,
        pageData,
        locale,
        error: data.value?.error,
    }
}
