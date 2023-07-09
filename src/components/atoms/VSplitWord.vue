<template>
    <component :is="tag" :class="[$style.root, variableFont && $style['root--variable-font']]">
        <template v-for="(letter, i) in letters">
            <div
                :key="i"
                :class="[$style.letter, letter.isAfterSpace && $style['letter--after-space']]"
                class="split-word-letter"
                :aria-content="letter.content"
                :style="{ '--letter-index': i }"
            >
                {{ letter.content }}
            </div>
        </template>
    </component>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        tag: { type: String, default: 'div' },
        content: String,
        variableFont: Boolean,
    },
    computed: {
        slotContent(): string | undefined {
            return this.$slots.default?.[0]?.text
        },
        letters(): { content: string; isAfterSpace: boolean }[] | undefined {
            const letters = this.content?.split('') || this.slotContent?.split('')

            if (!letters?.length) return undefined

            return letters
                .map((letter: string, i: number) => {
                    return {
                        content: letter,
                        isAfterSpace: i > 0 && letters[i - 1] === ' ',
                    }
                })
                .filter((letter) => !/\s/.test(letter.content))
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    display: flex;
}

.letter {
    position: relative;
    opacity: 1;

    .root--variable-font & {
        font-variation-settings: 'wght' var(--font-weight, 300), 'ital' var(--font-italic, 0);
        transition: font-variation-settings 0.3s ease(out-quad);
    }

    &--after-space {
        margin-left: 0.3em;
    }
}
</style>
