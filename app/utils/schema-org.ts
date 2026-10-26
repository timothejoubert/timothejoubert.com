import { withTrailingSlash } from 'ufo'
import { ensureProtocol } from '~/utils/url'

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
