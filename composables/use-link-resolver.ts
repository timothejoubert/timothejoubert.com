import type { LocationAsRelativeRaw, _RouteRecordBase } from 'vue-router'
import { isPrismicDocument } from '~/utils/prismic/guard'
import type { ReachableDocument } from '~/types/api'

export type PossibleRouteReference = string | undefined | null | LocationAsRelativeRaw | _RouteRecordBase | ReachableDocument

export function useLinkResolver(reference: PossibleRouteReference) {
    const siteUrl = useRuntimeConfig().public?.site.url
    const router = useRouter()

    const url = computed(() => {
        if (!reference) {
            return undefined
        }
        else if (isPrismicDocument(reference) && 'url' in reference) {
            return reference.url
        }
        else if (typeof reference === 'object' && 'name' in reference) {
            return router.hasRoute(reference.name as string) ? router.resolve(reference)?.fullPath : undefined
        }
        else if (typeof reference === 'object') {
            return router.resolve(reference)?.fullPath
        }
        else return reference
    })

    const isRelative = computed(() => {
        const firstChar = toValue(url)?.charAt(0)
        if (firstChar && (firstChar === '/' || firstChar === '#')) return true

        return siteUrl && !!toValue(url)?.startsWith(siteUrl)
    })

    const isExternal = computed(() => !isRelative.value && !!toValue(url))

    return { isRelative, isExternal, url }
}
