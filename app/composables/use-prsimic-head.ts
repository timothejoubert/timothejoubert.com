import { joinURL } from 'ufo'
import type { Link, Script } from '@unhead/schema'
import { getFormattedLocale } from '~/composables/use-prismic-locale'
import { I18N_DEFAULT_LOCALE } from '~~/i18n/i18n'
import type { ReachableDocument } from '~/types/api'

export function usePrismicHead(document?: ReachableDocument) {
	const { $i18n } = useNuxtApp()
	const { site, version } = useRuntimeConfig().public
	const route = useRoute()

	const script: (Script<['script']> | string)[] = []
	const link: Link[] = [
		{
			rel: 'canonical',
			href: joinURL(site.url, document?.url || route.path),
		},
	]

	// ALTERNATE LINKS
	const alternateLinks = [
		...(document?.alternate_languages || []),
		{ id: 'default', type: document?.type || '', lang: I18N_DEFAULT_LOCALE },
	]

	alternateLinks.forEach((alternateLink) => {
		const formattedLocale = getFormattedLocale(alternateLink.lang)
		const locale = formattedLocale === I18N_DEFAULT_LOCALE ? '' : formattedLocale

		link.push({
			hid: `alternate-${alternateLink.lang}`,
			rel: 'alternate',
			hreflang: alternateLink.lang,
			href: joinURL(site.url, locale || '', route.path),
		})
	})

	const title = computed(() => {
		return document?.data?.meta_title || `${document?.data?.title} | ${site.name}`
	})

	useHead({
		htmlAttrs: {
			lang: $i18n.locale.value,
		},
		title,
		script,
		link,
		meta: [
			{ name: 'version', content: version },
		],
	})
}
