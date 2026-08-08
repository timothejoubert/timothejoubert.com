import { computed, toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { asText, type ImageField, type KeyTextField, type RichTextField } from '@prismicio/client'
import { joinURL } from 'ufo'
import type { ReachableDocument } from '~/types/api'
import { getFormattedLocale } from '~/composables/use-prismic-locale'
import { ensureProtocol } from '~/utils/url'
import { I18N_DEFAULT_LOCALE } from '~~/i18n/i18n'
import type { PageMetaAlternateLink } from '~/composables/use-page-meta'

interface PrismicDocumentPageData extends Record<string, unknown> {
	meta_title?: KeyTextField
	meta_description?: KeyTextField
	meta_image?: ImageField
	// Possible page field
	image?: ImageField
}

export function usePrismicMeta(documentOrRef?: MaybeRefOrGetter<ReachableDocument | null | undefined>) {
	const doc = toRef(documentOrRef)
	const { site } = useRuntimeConfig().public
	const siteUrl = ensureProtocol(site.url)
	const generateImg = useImage()
	const route = useRoute()

	const docData = computed(() => doc.value?.data as PrismicDocumentPageData | undefined)

	const title = computed(() => {
		const pageTitle = docData.value?.meta_title || docData.value?.title
		return pageTitle ? `${pageTitle} | ${site.name}` : site.name
	})

	const description = computed(() => {
		if (docData.value?.meta_description) return docData.value.meta_description

		const content = docData.value?.content
		if (!content) return undefined
		if (typeof content === 'string') return content
		return asText(content as RichTextField) || undefined
	})

	const image = computed(() => {
		const imgUrl = docData.value?.meta_image?.url || docData.value?.image?.url
		if (imgUrl) {
			return generateImg(
				imgUrl,
				{ width: 1200, height: 700 },
				{ provider: 'ipx', modifiers: { fit: 'crop' } },
			)
		}
		else {
			return joinURL(siteUrl, '/share.jpg')
		}
	})

	const noindex = usePrismicPreviewRoute().isPreview
	// route.path first: Prismic's own doc.url can't disambiguate types that map to more than one
	// route (e.g. project pages are reachable from both home and archive), so it isn't reliable
	// as a canonical URL — the actually-served route always is.
	const canonicalUrl = computed(() => joinURL(siteUrl, route.path || doc.value?.url))

	const alternateLinks = computed<PageMetaAlternateLink[]>(() => {
		const alts = [
			...(doc.value?.alternate_languages || []),
			{ id: 'default', type: doc.value?.type || '', lang: I18N_DEFAULT_LOCALE },
		]
		return alts.map((alt) => {
			const formattedLocale = getFormattedLocale(alt.lang)
			const locale = formattedLocale === I18N_DEFAULT_LOCALE ? '' : formattedLocale
			return {
				locale: alt.lang,
				href: joinURL(siteUrl, locale || '', route.path),
			}
		})
	})

	const { head } = usePageMeta({ title, description, image, canonicalUrl, alternateLinks, noindex })
	useHead(head)

	return { title, description, image, canonicalUrl, alternateLinks, noindex }
}
