<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode, VNodeData } from 'vue'
import type { PrismicDocument } from '@prismicio/types'
import { LinkField } from '@prismicio/types/src/value/link'
import { hasUid, isPrismicDocument } from '~/types/prismic/prismic-guard'
import { getRelationLinkDocument, isInternalRelationLinkFulled, isRelationType } from '~/utils/prismic/relation-field'

type CustomVNodeData = VNodeData & Required<Pick<VNodeData, 'props' | 'attrs'>>

type LinkReference = PrismicDocument | LinkField

export default Vue.extend({
    name: 'VLink',
    functional: true,
    props: {
        label: {
            type: [String, Boolean],
            default: undefined,
        },
        href: String,
        reference: Object as PropType<LinkReference>,
    },
    render(createElement, context): VNode | VNode[] {
        const { href, reference } = context.props

        if (!href && !reference) {
            return (
                context.scopedSlots.default?.({ label: context.props.label }) ||
                context.slots()?.default ||
                (context.props.label && createElement('span', [context.props.label])) ||
                createElement('')
            )
        }

        const document = isPrismicDocument(reference)
            ? (reference as PrismicDocument)
            : isInternalRelationLinkFulled(reference)
            ? getRelationLinkDocument(reference as LinkField)
            : undefined

        const isDocument = document && hasUid(document)

        let url = context.parent.$getLocalePath()

        if (isDocument && document?.uid) {
            url += '/' + document.uid
        } else if (isRelationType(reference as LinkField, 'Web') && !!(reference as { url?: string })?.url) {
            url += (reference as { url: string }).url
        } else if (href) {
            url += href
        }

        const data: CustomVNodeData = Object.assign({ props: {}, attrs: {} }, context.data)

        const isInternal = (isDocument || url?.charAt(0) === '#') && !context.data.attrs?.target
        const isExternal = !isInternal && !!url
        const isDownload = !isInternal && !isExternal
        let label: string | undefined | boolean = context.props.label

        if (!label) label = 'Fallback Label'

        if (isInternal) {
            data.props.to = url
        } else if (isExternal) {
            data.attrs = {
                ...data.attrs,
                href: url,
                target: context.data.attrs?.target || '_blank',
                rel: !isDocument && 'noopener',
            }
        }

        if (!url) {
            return context.slots()?.default
                ? createElement('div', { class: context.data.class }, context.slots()?.default)
                : label
                ? createElement('span', String(label))
                : createElement('')
        }

        return createElement(
            isExternal || isDownload ? 'a' : 'nuxt-link',
            data,
            context.slots()?.default || (label && String(label)) || ''
        )
    },
})
</script>
