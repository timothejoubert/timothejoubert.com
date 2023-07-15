<script lang="ts">
import Vue from 'vue'
import type { VNode } from 'vue'
import VSplitLetters from '~/components/atoms/VSplitLetters.vue'

export default Vue.extend({
    name: 'VSplitWords',
    functional: true,
    props: {
        tag: { type: String, default: 'div' },
        content: String,
    },
    render(createElement, context): VNode[] | VNode {
        const content = context.props.content || context.slots().default?.[0]?.text
        const words = content.split(' ').filter((word: string) => word !== ' ')

        let letterCount = 0

        return words.map((word: string, index: number) => {
            letterCount += words?.[index - 1]?.length || 0

            return createElement(
                context.props.tag,
                {
                    class: [context.data.class, context.$style.root],
                    staticClass: (context.data?.staticClass || '') + ' split-word',
                    style: { '--word-index': index },
                },
                [
                    createElement(VSplitLetters, {
                        props: { content: word, previousWordLength: letterCount, variableFont: true },
                    }),
                ]
            )
        })
    },
})
</script>
<style lang="scss" module>
.root {
    margin-right: 0.25em;

    &:last-child {
        margin-right: 0;
    }
}
</style>
