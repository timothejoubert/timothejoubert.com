import { toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { ProjectDocument } from '~~/prismicio-types'
import { getFilledLinkToMedia } from '~/utils/prismic/link-field'

interface PrismicProjectSchemaOrgMeta {
	title: string
	description?: string
	canonicalUrl: string
}

/** schema.org `CreativeWork` (or Prismic-driven subtype) node for a project document — `@type` is sourced verbatim from the `creative_work_type` Select field, no mapping needed. */
export function usePrismicProjectSchemaOrg(documentOrRef: MaybeRefOrGetter<ProjectDocument | null | undefined>, meta: PrismicProjectSchemaOrgMeta) {
	const doc = toRef(documentOrRef)
	if (!doc.value) return

	const { data } = doc.value

	useSchemaOrg([
		{
			'@type': data.creative_work_type || 'CreativeWork',
			name: meta.title,
			description: meta.description,
			image: getFilledLinkToMedia(data.thumbnail)?.url,
			dateCreated: data.date || undefined,
			url: meta.canonicalUrl,
			keywords: data.tag_group.map(({ tag }) => tag).filter(Boolean),
			award: data.awards.map(({ name }) => name).filter(Boolean),
		},
	])
}
