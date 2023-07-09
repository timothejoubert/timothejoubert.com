<template>
    <component :is="tag" v-if="typeof content === 'string'">{{ content }}</component>
    <prismic-rich-text v-else-if="isRichTextFilled" :field="content" />
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import type { RichTextField } from '@prismicio/types'

export default Vue.extend({
    name: 'VText',
    props: {
        tag: { type: String, default: 'div' },
        content: [String, Array] as PropType<String | RichTextField>,
        textClass: [String, Array] as PropType<String | String[]>,
    },
    computed: {
        isRichTextFilled(): boolean {
            return !!(this.content?.[0] as Partial<Record<'text', string>>)?.text
        },
    },
})
</script>
