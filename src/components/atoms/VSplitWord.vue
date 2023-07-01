<template>
    <component :is="tag" :class="[$style.root, playAnimation && $style['root--animate']]">
        <template v-for="(letter, i) in letters">
            <div
                :key="i"
                :class="[$style.letter, letter.isAfterSpace && $style['letter--after-space']]"
                :style="{ '--letter-index': i }"
                :aria-content="letter.content"
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
        word: String,
        isAnimated: { type: Boolean, default: true },
        playAnimation: Boolean,
    },
    computed: {
        slotContent(): string | undefined {
            return this.$slots.default?.[0]?.text
        },
        letters(): { content: string; isAfterSpace: boolean }[] | undefined {
            const letters = this.word?.split('') || this.slotContent?.split('')

            if (!letters?.length) return undefined

            return letters
                .map((letter: string, i: number) => {
                    return {
                        content: letter,
                        isAfterSpace: i > 0 && letters[i - 1] === ' ',
                    }
                })
                .filter((letter) => letter.content !== ' ')
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    overflow: hidden;
}

.letter {
    position: relative;
    display: block;
    opacity: 1;

    &--after-space {
        margin-left: 0.3em;
    }

    &::after {
        position: absolute;
        top: 0;
        left: 0;
        content: attr(aria-content);
        opacity: 0;
        transition: opacity 300ms calc(var(--letter-index) * 20ms) ease(out-quad);
        translate: 0 100%;
    }

    .root--animate & {
        animation: slide-up var(--split-word-duration, 350ms) calc(var(--letter-index) * 20ms) ease(out-quad);
    }

    .root--animate &::after {
        opacity: 1;
    }

    @media (hover: hover) {
        .root:not(.root--animate):hover & {
            animation: slide-up var(--split-word-duration, 350ms) calc(var(--letter-index) * 20ms) ease(out-quad);
        }

        .root:not(.root--animate):hover &::after {
            opacity: 1;
        }
    }
}

@keyframes slide-up {
    to {
        translate: 0 -100%;
    }
}
</style>
