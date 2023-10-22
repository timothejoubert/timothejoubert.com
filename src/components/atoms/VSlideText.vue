<template>
    <component :is="tag || 'div'" v-if="content" :class="[$style.root, playAnimation && $style['root--animate']]">
        <v-split-letters :content="content" />
    </component>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        tag: String,
        content: String,
        isAnimated: { type: Boolean, default: true },
        playAnimation: Boolean,
    },
})
</script>
<style lang="scss" module>
.root {
    overflow: hidden;

    & :global(.split-word-letter::after) {
        position: absolute;
        top: 0;
        left: 0;
        content: attr(letter-value);
        opacity: 0;
        transition: opacity 300ms calc(var(--letter-index) * 20ms) ease(out-quad);
        translate: 0 100%;
    }

    &--animate :global(.split-word-letter) {
        animation: slide-up var(--split-word-duration, 350ms) calc(var(--letter-index, 0) * 22ms) ease(out-quad);
    }

    &--animate :global(.split-word-letter::after) {
        opacity: 1;
    }

    @media (hover: hover) {
        &:not(#{&}--animate):hover :global(.split-word-letter) {
            animation: slide-up var(--split-word-duration, 350ms) calc(var(--letter-index) * 20ms) ease(out-quad);
        }

        &:not(#{&}--animate):hover :global(.split-word-letter::after) {
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
