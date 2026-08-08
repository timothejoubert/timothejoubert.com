import type { ExtractPrismicDocument, PrismicDocumentType } from '~/types/api'
import { isDynamicDocument } from '~~/shared/prismic-schema'

export async function usePrismicFetchDocument<Type extends PrismicDocumentType = PrismicDocumentType>(prismicDocument: Type | undefined) {
	const route = useRoute()
	const routeUid = route.params?.uid || ''
	const uid = Array.isArray(routeUid) ? routeUid.at(-1) : routeUid // get the last uid when route has subPage

	const { documentId, isPreview } = usePrismicPreviewRoute()

	const dataKey = `page-${prismicDocument}-${uid || documentId.value || 'single-document'}`

	const prismicClient = usePrismic().client
	const { fetchLocaleOption } = useLocale()

	const prismicFetchOptions = {
		...fetchLocaleOption.value,
		brokenRoute: '/404',
	}

	const { data, error } = await useAsyncData(dataKey, async () => {
		try {
			if (isPreview.value && documentId.value) {
				return await prismicClient.getByID(documentId.value, prismicFetchOptions)
			}
			else if (uid && prismicDocument && isDynamicDocument(prismicDocument)) {
				return await prismicClient.getByUID(prismicDocument, uid, prismicFetchOptions)
			}
			else if (prismicDocument) {
				return await prismicClient.getSingle(prismicDocument, prismicFetchOptions)
			}
		}
		catch (error) {
			console.error('Error during Prismic document fetch', error)
			return { data: null }
		}
	}, {
		getCachedData: (key, nuxtApp) => nuxtApp.static.data?.[key] ?? nuxtApp.payload.data?.[key],
		dedupe: 'defer',
		deep: false,
	})

	return {
		data: computed(() => data.value as ExtractPrismicDocument<Type>),
		error,
	}
}
