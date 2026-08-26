import type { ExtractDocumentType } from '~/types/api'
import { prismicDocumentRoutes } from '~~/shared/prismic-schema'
import type { ProjectDocument } from '~~/prismicio-types'
import { generateHashFromObject } from '~/utils/hash'

type PrismicClient = ReturnType<typeof usePrismic>['client']
export type GetAllByTypeParams = Parameters<PrismicClient['getAllByType']>[1]

export type RepeatableDocument = ProjectDocument
export type RepeatableDocumentType = ExtractDocumentType<ProjectDocument>

export function usePrismicFetchDocumentListing(
	prismicDocument: RepeatableDocumentType, options: MaybeRefOrGetter<GetAllByTypeParams> = {},
) {
	const prismicClient = usePrismic().client
	const fetchOptions = computed(() => {
		return {
			// pageSize: value.pageSize || 12, // default 20
			limit: toValue(options)?.pageSize || 2, // default 20
			routes: prismicDocumentRoutes,
			brokenRoute: '/404',
			...useLocale()?.fetchLocaleOption.value,
			...toValue(options),
		}
	})

	const hash: string[] = [prismicDocument]
	if (Object.keys(fetchOptions.value).length) hash.push(generateHashFromObject(fetchOptions.value))

	const key = `documents-${hash.join('-')}`

	return useAsyncData(key, () => prismicClient.getAllByType(prismicDocument, toValue(options)), {
		// Only reuse cached data for the component's initial fetch (e.g. a remount caused by the
		// project-modal nested route's first Suspense activation — see docs/project-modal-routing.md)
		// — not for `watch`-triggered refetches, otherwise changing `fetchOptions` (e.g. sort
		// ordering on the archive page) would just re-serve the stale cached list instead of
		// actually refetching.
		getCachedData: (key, nuxtApp, ctx) => {
			if (ctx.cause !== 'initial') return undefined
			return nuxtApp.static.data?.[key] ?? nuxtApp.payload.data?.[key]
		},
		lazy: false,
		watch: [fetchOptions],
	})
}
