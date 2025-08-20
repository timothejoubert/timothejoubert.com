import { getDocumentTypeByUrl } from '~/utils/prismic/route-resolver'
import type { PrismicDocumentType, ReachableDocument } from '~/types/api'

export async function useFetchPage<T extends ReachableDocument>(type: PrismicDocumentType | undefined) {
	const route = useRoute()
	const documentType = type || getDocumentTypeByUrl(route.path)
	const { isPreview } = usePrismicPreviewRoute()

	if (!documentType && !isPreview.value) {
		throw showError({
			message: 'can\'t find prismic document to display during use-fetch-page',
			status: 404,
		})
	}

	const { data, error } = await usePrismicFetchDocument<T>(documentType)

	if (error.value) {
		throw showError(error.value)
	}

	usePage({ document: data.value })

	if (data.value) {
		usePrismicHead(data.value)
		usePrismicSeoMeta(data.value)
	}

	return {
		document: data,
		documentType: computed(() => data.value.type),
	}
}
