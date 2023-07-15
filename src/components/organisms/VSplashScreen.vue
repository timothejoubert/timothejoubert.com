<template>
    <div :class="rootClass">
        <div :class="$style.center">
            <transition :name="$style.title" @after-enter="onLettersEnterDone" @after-leave="onLettersLeaveDone">
                <v-split-words v-if="isElementVisible" ref="word" :class="$style.title" class="text-h1" content="tim" />
            </transition>
            <transition :name="$style.slider" @after-enter="onSliderEnterDone">
                <div v-if="isElementVisible" :class="$style.slider"></div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { SplashScreenState } from '~/components/organisms/VSplashScreenWrapper.vue'

export default Vue.extend({
    name: 'VSplashScreen',
    props: {
        value: String as PropType<SplashScreenState>,
    },
    computed: {
        rootClass(): (string | undefined | false)[] {
            return [
                this.$style.root,
                this.value === 'animating' && this.$style['root--animating'],
                this.value === 'leave' && this.$style['root--leave'],
            ]
        },
        isElementVisible() {
            return this.value !== 'pending' && this.value !== 'leave'
        },
    },
    methods: {
        onSliderEnterDone() {
            console.log('set animating')
            this.$emit('input', 'animating')
        },
        onLettersEnterDone() {
            console.log('on letters Enter Done')
            this.$emit('input', 'leave')
        },
        onLettersLeaveDone() {
            console.log('on after leave')
            this.$emit('input', 'done')
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 102;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    background-color: var(--theme-foreground-color);

    &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--theme-background-color);
        border-radius: 8px 64px 8px 8px;
        content: '';
        scale: 1.05;
        transition: scale 1.3s ease(out-quad);
    }

    &--animating::after {
        scale: 0.98 0.98;
    }

    &--leave::after {
        scale: 1.05;
    }
}

.center {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.title {
    margin: 0 0 rem(40);
    text-align: center;

    &:global(#{'-enter-active'}) {
        // transition after-enter not working for nested child like .split-word-letter
        transition: opacity 2.5s;
    }

    &:global(#{'-leave-active'}) {
        transition: opacity 1s;
    }

    //&:global(#{'-enter'}) {
    //    opacity: 0;
    //}

    & :global(.split-word-letter) {
        --font-weight: 100;
        --font-italic: 10;

        display: inline-block;
        letter-spacing: rem(8);
        opacity: 0;
        scale: 0.8;
        transform-origin: top center;
        transition: font-variation-settings, opacity, translate, scale;
        transition-delay: calc(var(--letter-index) * 100ms);
        transition-duration: 0.7s;
        transition-timing-function: ease(out-quad);
        translate: 0 -40px;
    }

    .root--animating & :global(.split-word-letter) {
        opacity: 1;
        scale: 1;
        translate: 0 0;

        --font-weight: 900;
        --font-italic: 0;
    }
}

.slider {
    position: relative;
    width: 300px;
    height: 2px;
    background-color: var(--theme-foreground-color);

    &::after {
        position: absolute;
        top: -8px;
        width: 18px;
        height: 18px;
        border: 2px solid var(--theme-foreground-color);
        background-color: var(--theme-background-color);
        content: '';
        transition: translate 2s ease(out-quart);
    }

    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition: translate 1s, opacity 1s;
    }

    &:global(#{'-enter'}),
    &:global(#{'-leave-to'}) {
        opacity: 0;
        translate: 0 20px;
    }

    .root--leave &::after,
    .root--animating &::after {
        translate: 300px 0;
    }
}
</style>
