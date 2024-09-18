<script lang="ts">
import { h, type PropType } from 'vue'
import type { NuxtLinkProps } from '#app/components/nuxt-link'
import { NuxtLink } from '#components'
import type { ReachableDocument } from '~/types/api'
import { type PossibleRoutePath, usePathLinkParser } from '~/composables/use-link-path-parser'

export const vLinkProps = {
    label: [String, Boolean],
    to: [Object, String] as PropType<ReachableDocument | string | PossibleRoutePath>,
    nuxtLinkProps: Object as PropType<NuxtLinkProps>,
    custom: Boolean, // use scoped slot
}

export default defineComponent({
    inheritAttrs: false,
    props: vLinkProps,
    setup(props, { attrs, slots }) {
        const { isRelative, isExternal, url } = usePathLinkParser(props.to)

        // A VLink without URL or reference will render nothing except the default slot if present, fallback to the label, or at least nothing
        if (!url) {
            return () =>
                slots.default?.({ label: props.label })
                || (typeof props.label === 'string' && h('span', attrs, props.label))
                || null
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

        if (props.custom) {
            const vNode = slots.default?.({ ...attributes.value })

            if (vNode?.length) return () => vNode[0]
        }

        // By default return a NuxtLink component
        return () => h(NuxtLink, attributes.value, slots.default || (() => (typeof props.label === 'string' && props.label) || ''))
    },
})
</script>
