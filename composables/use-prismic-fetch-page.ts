import type { DocumentType } from '~/types/api'
import { isDynamicDocument, isExistingDocumentType } from '~/utils/prismic/document-type'

export async function usePrismicFetchPage(prismicDocument: DocumentType) {
    const route = useRoute()
    const routeUid = route.params?.uid || ''
    const uid = Array.isArray(routeUid) ? routeUid.at(-1) : routeUid
    const key = `fetched-page-${prismicDocument}-${uid || 'unique'}`

    const { data } = await useAsyncData(key, async () => {
            try {
                const prismicClient = usePrismic().client
                const { fetchLocaleOption } = useLocale()

                if (uid && isDynamicDocument(prismicDocument)) {
                    return await prismicClient.getByUID(prismicDocument, uid, { ...fetchLocaleOption.value })
                } else if (isExistingDocumentType(prismicDocument)) {
                    return await prismicClient.getSingle(prismicDocument, { ...fetchLocaleOption.value,})
                }
            }
            catch (error: unknown) {
                console.error(`PrismicError in useFetchPage on ${prismicDocument} `, error)
                // @ts-expect-error cannot know the error type
                return { error: createError(error) }
            }
        })

    const response = data.value

    return {
        webResponse: (!!response && !('error' in response)) ? response : undefined,
        error: (!!response && ('error' in response)) ? response.error: undefined,
    }
}
