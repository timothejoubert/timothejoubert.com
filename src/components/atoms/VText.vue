<template>
    <component :is="tag || 'div'" v-if="stringContent">{{ stringContent }}</component>
    <prismic-rich-text v-else-if="isRichTextFilled" :field="content" />
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { RTNode } from '@prismicio/types/src/value/richText'
import { PrismicRichText } from '~/types/app'

export function getTextFieldContent(content: PrismicRichText | string) {
    if (content === 'string') {
        return content
    } else if (Array.isArray(content)) {
        return getRichTextContent(content)
    } else {
        return undefined
    }
}

function getRichTextContent(richText: PrismicRichText): string | undefined {
    if (!richText?.length) return

    return (richText as any)
        .filter((content: RTNode & { text?: string }) => content?.text)
        .reduce((acc: string, content: { text: string }) => (acc += content.text), '')
}

export default Vue.extend({
    name: 'VText',
    props: {
        tag: { type: String },
        content: [String, Array] as PropType<string | PrismicRichText>,
        textClass: [String, Array] as PropType<string | string[]>,
        flat: Boolean,
    },
    computed: {
        isRichTextFilled(): boolean {
            return !!(this.content?.[0] as { text?: string })?.text
        },
        stringContent(): string | undefined {
            if (typeof this.content === 'string') return this.content
            else if (this.flat) return getTextFieldContent(this.content)
        },
    },
})
</script>
