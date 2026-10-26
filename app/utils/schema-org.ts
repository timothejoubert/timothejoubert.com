import { withTrailingSlash } from 'ufo'
import { ensureProtocol } from '~/utils/url'

// Absolute `@id`s on purpose: nuxt-schema-org only resolves relative references (`{ '@id': '#identity' }`)
// inside the relations its own resolvers handle (e.g. not `Person.image`, a non-`ProfilePage`
// `WebPage.mainEntity`, or any property of a raw node), so a relative one would end up as-is in the graph.

/** `@id` of the global `Person` node (nuxt-schema-org's identity, filled by `usePrismicPersonSchemaOrg`). */
export function getSchemaOrgIdentityId(siteUrl: string) {
    return `${withTrailingSlash(ensureProtocol(siteUrl))}#identity`
}

/** `@id` of the `Person`'s portrait, stable across pages (nuxt-schema-org would otherwise number it by position in each page's graph). */
export function getSchemaOrgIdentityImageId(siteUrl: string) {
    return `${withTrailingSlash(ensureProtocol(siteUrl))}#identity-image`
}

/** `@id` of a page's main image, scoped to that page's canonical URL. */
export function getSchemaOrgPrimaryImageId(canonicalUrl: string) {
    return `${canonicalUrl}#primaryimage`
}

/** `@id` of a page's `WebPage` node (same value nuxt-schema-org gives it: canonical URL + `#webpage`). */
export function getSchemaOrgWebPageId(canonicalUrl: string) {
    return `${canonicalUrl}#webpage`
}

/** `@id` of a project's `CreativeWork` node, the main entity of its page. */
export function getSchemaOrgWorkId(canonicalUrl: string) {
    return `${canonicalUrl}#work`
}
