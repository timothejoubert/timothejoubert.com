<template>
    <component :is="tag || 'div'" v-if="typeof content === 'string'">{{ content }}</component>
    <prismic-rich-text v-else-if="isRichTextFilled" :field="content" />
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { PrismicRichText } from '~/types/app'

export default Vue.extend({
    name: 'VText',
    props: {
        tag: { type: String },
        content: [String, Array] as PropType<String | PrismicRichText>,
        textClass: [String, Array] as PropType<String | String[]>,
    },
    computed: {
        isRichTextFilled(): boolean {
            return !!(this.content?.[0] as { text?: string })?.text
        },
    },
})
</script>
