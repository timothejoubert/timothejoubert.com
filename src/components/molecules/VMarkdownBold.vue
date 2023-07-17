<template>
    <component :is="wrapperTag">
        <component
            :is="node.tag"
            v-for="(node, i) in parsedHtml"
            v-bind="node.props"
            :key="node.start + i"
            :class="node.class"
        >
            {{ node.content }}</component
        >
    </component>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import type { RichTextField } from '@prismicio/types'
import { RTInlineNode, RTTextNodeBase } from '@prismicio/types/src/value/richText'
import EventType from '~/constants/event-type'

interface ParsedHtml {
    content: string
    tag: string
    start: number
    props?: { [key: string]: any }
    class?: string
}

export default Vue.extend({
    name: 'VMarkdownBold',
    props: {
        content: Array as PropType<RichTextField | RichTextField[]>,
        wrapperTag: { type: String, default: 'p' },
    },
    computed: {
        parsedHtml(): ParsedHtml[] {
            const { spans, text } = this.content[0] as RTTextNodeBase
            const nodeRawLength =
                spans.length -
                1 +
                (spans[0].start === 0 ? 1 : 0) +
                (spans[spans.length - 1]?.end === text.length ? 1 : 0)
            const nodes = [...spans, ...[...Array(nodeRawLength).keys()].map(() => null)]

            const result = [] as ParsedHtml[]
            let nodeAdded = 0
            nodes.forEach((richTextContent: RTInlineNode | null) => {
                if (!richTextContent) {
                    result.push({
                        content: text
                            .substring(spans[nodeAdded - 1]?.end || 0, spans[nodeAdded]?.start || text.length)
                            .trimLeft(),
                        tag: 'span',
                        start: spans[nodeAdded - 1]?.start || 0,
                    })
                    nodeAdded++
                } else {
                    result.push({
                        content: text.substring(richTextContent.start, richTextContent.end).trimLeft(),
                        tag: 'v-interactive-text',
                        props: { triggerEvent: EventType.ABOUT_TRANSITION_ENTERED },
                        class: 'v-markdown-bold-strong',
                        start: richTextContent.start,
                    })
                }
            })

            return result.sort((current, iterable) => current.start - iterable.start)
        },
    },
})
</script>
