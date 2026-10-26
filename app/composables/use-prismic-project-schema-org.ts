import { toRef } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { ProjectDocument } from '~~/prismicio-types'
import { getFilledLinkToMedia, getFilledLinkToWeb } from '~/utils/prismic/link-field'
import { getSchemaOrgIdentityId, getSchemaOrgPrimaryImageId, getSchemaOrgWebPageId, getSchemaOrgWorkId } from '~/utils/schema-org'
import { ensureProtocol } from '~/utils/url'

// A type alias (not an interface) so it stays assignable to schema-org's index-signatured `ListItem`.
type PrismicProjectSchemaOrgBreadcrumbEntry = {
    name: string
    item: string
}

interface PrismicProjectSchemaOrgMeta {
    title: string
    description?: string
    canonicalUrl: string
    /** Ancestor listing(s) (e.g. home/archive) the project is reached from — this project's own
     * entry is appended automatically, callers only pass what comes before it. */
    breadcrumb?: PrismicProjectSchemaOrgBreadcrumbEntry[]
}

/** schema.org `CreativeWork` (or Prismic-driven subtype) node for a project document — `@type` is sourced verbatim from the `creative_work_type` Select field, no mapping needed. */
export function usePrismicProjectSchemaOrg(documentOrRef: MaybeRefOrGetter<ProjectDocument | null | undefined>, meta: PrismicProjectSchemaOrgMeta) {
    const doc = toRef(documentOrRef)
    if (!doc.value) return

    const { data } = doc.value
    // Stable `@id` so the page's `WebPage` can point to the work as its main entity
    const workId = getSchemaOrgWorkId(meta.canonicalUrl)
    const image = getFilledLinkToMedia(data.thumbnail)?.url
    // The delivered work itself (e.g. the client's website), not this portfolio page describing it
    const externalUrl = getFilledLinkToWeb(data.link)?.url

    // Explicit `@id`: auto-numbered image ids (`#/schema/image/1`) point to different images from one page to another
    const imageId = getSchemaOrgPrimaryImageId(meta.canonicalUrl)

    useSchemaOrg([
        ...(image ? [defineImage({ '@id': imageId, 'url': image })] : []),
        {
            '@id': workId,
            '@type': data.creative_work_type || 'CreativeWork',
            // The bare project title: `meta.title` carries the " | site name" suffix of the <title> tag
            'name': data.title || meta.title,
            'description': meta.description,
            'image': image ? { '@id': imageId } : undefined,
            'dateCreated': data.date || undefined,
            'url': externalUrl ? ensureProtocol(externalUrl) : meta.canonicalUrl,
            'mainEntityOfPage': { '@id': getSchemaOrgWebPageId(meta.canonicalUrl) },
            // Same `@id` as the global `Person` node, so the work is attributed to its author
            'creator': { '@id': getSchemaOrgIdentityId(useRuntimeConfig().public.site.url) },
            'keywords': data.tag_group.map(({ tag }) => tag).filter(Boolean),
            'award': data.awards.map(({ name }) => name).filter(Boolean),
        },
        // No `image` here: the work already carries it, a second reference would duplicate the ImageObject
        defineWebPage({
            mainEntity: { '@id': workId },
        }),
        defineBreadcrumb({
            itemListElement: [
                ...(meta.breadcrumb || []),
                // The bare project title, not `meta.title` (which carries the " | site name" suffix
                // used for the <title> tag — redundant/noisy as a breadcrumb label).
                { name: data.title || meta.title, item: meta.canonicalUrl },
            ],
        }),
    ])
}
