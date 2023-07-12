<script lang="ts">
import Vue from 'vue'
import type { VNode } from 'vue'

export default Vue.extend({
    name: 'VSplitLetters',
    functional: true,
    props: {
        tag: { type: String, default: 'span' },
        content: String,
        previousWordLength: Number,
        variableFont: Boolean,
    },
    render(createElement, context): VNode | VNode[] {
        const { content, previousWordLength, tag, variableFont } = context.props

        const letters = content?.split('') || context.slots().default?.[0]?.text
        if (!letters?.length) return createElement('')

        return letters.map((letter: string, i: number) => {
            return createElement(
                letter === ' ' ? '' : tag,
                {
                    attrs: {
                        'aria-content': letter,
                    },
                    class: [
                        context.data.class,
                        context.$style.root,
                        variableFont && context.$style['root--variable'],
                        letters?.[i - 1] === ' ' && context.$style['root--after-space'],
                    ],
                    staticClass: 'split-word-letter',
                    style: { '--letter-index': i + (previousWordLength ?? 0) },
                },
                letter
            )
        })
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;

    &--variable {
        font-variation-settings: 'wght' var(--font-weight, 300), 'ital' var(--font-italic, 0);
        //transition: font-variation-settings 0.3s ease(out-quad);
    }

    &--after-space {
        margin-left: 0.3em;
    }
}
</style>
