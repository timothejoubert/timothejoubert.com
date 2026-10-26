import { withTrailingSlash } from 'ufo'
import { ensureProtocol } from '~/utils/url'

/** `@id` of the global `Person` node (nuxt-schema-org's identity, filled by `usePrismicPersonSchemaOrg`). */
export function getSchemaOrgIdentityId(siteUrl: string) {
    return `${withTrailingSlash(ensureProtocol(siteUrl))}#identity`
}
