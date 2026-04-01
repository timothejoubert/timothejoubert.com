import type { KeyTextField, RichTextField } from '@prismicio/client'

export function usePrismicText(field: KeyTextField | RichTextField | null | undefined | string) {
	const { $prismic } = useNuxtApp()

	return computed(() => {
		if (!field) return
		else if (typeof field === 'string') return field
		else if ($prismic.asText(field)) return $prismic.asText(field)

		return
	})
}
