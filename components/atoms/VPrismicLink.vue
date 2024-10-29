<script lang="ts">
import { h, type PropType } from 'vue'
import type { NuxtLinkProps } from '#app/components/nuxt-link'
import { NuxtLink } from '#components'
import { type PossibleRouteReference, useLinkResolver } from '~/composables/use-link-resolver'

export const vPrismicLinkProps = {
    to: [Object, String] as PropType<PossibleRouteReference>,
    nuxtLinkProps: Object as PropType<NuxtLinkProps>,
    custom: Boolean, // use scoped slot
}

export default defineComponent({
    inheritAttrs: false,
    props: vPrismicLinkProps,
    setup(props, { attrs, slots }) {
        const { isRelative, isExternal, url } = useLinkResolver(props.to)

        // A VPrismicLink without URL or reference will render slot
        if (!url) {
            return () => slots.default?.() || null
        }

        // Define attributes
        const attributes = computed(() => {
            const result = { ...attrs, ...props.nuxtLinkProps }

            if (isRelative.value) {
                Object.assign(result, { to: url })
            }
            else if (isExternal) {
                Object.assign(result, {
                    target: attrs?.target || '_blank',
                    rel: attrs?.rel || 'noopener noreferrer',
                    href: url.value,
                })
            }

            return result
        })

        // Render scoped slot data
        if (props.custom) {
            const vNode = slots.default?.({ ...attributes.value })

            if (vNode?.length) return () => vNode[0]
        }

        // By default return a NuxtLink component
        return () => h(NuxtLink, attributes.value, slots.default)
    },
})
</script>
