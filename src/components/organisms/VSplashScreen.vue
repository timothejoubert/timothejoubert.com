<template>
    <div :class="rootClass">
        <div :class="$style.center">
            <transition :name="$style.title" @after-enter="onLettersEnterDone" @after-leave="onLettersLeaveDone">
                <v-split-words v-if="isElementVisible" ref="word" :class="$style.title" class="text-h1" content="tim" />
            </transition>
            <transition :name="$style.slider">
                <div v-if="isElementVisible" :class="$style.slider"></div>
            </transition>
            <transition :name="$style.tagline" @after-enter="onSliderEnterDone">
                <v-button
                    v-if="isElementVisible"
                    :class="$style.tagline"
                    tag="div"
                    label="Designer graphique & développeur"
                    theme="dark"
                    filled
                />
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
                this.value === 'appear' && this.$style['root--appear'],
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
            console.log('onSliderEnterDone')
            this.$emit('input', 'animating')
        },
        onLettersEnterDone() {
            console.log('onLettersEnterDone')
            this.$emit('input', 'leave')
        },
        onLettersLeaveDone() {
            console.log('onLettersLeaveDone')
            this.$emit('input', 'done')
        },
    },
})
</script>

<style lang="scss" module>
$slider-width: rem(350);

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
        transition: scale 1.3s 0.3s ease(out-quad);
    }

    &--appear::after,
    &--animating::after {
        scale: 0.98 0.98;
    }

    &--leave::after {
        scale: 1.05;
        transition-delay: 0s;
        transition-duration: 0.5s;
        transition-timing-function: ease(in-back);
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
    margin: 0 0 rem(16);
    text-align: center;

    &:global(#{'-enter-active'}) {
        // transition after-enter not working for nested child like .split-word-letter
        transition-duration: 2.5s;
        transition-property: opacity;
        transition-timing-function: ease(out-quad);
    }

    &:global(#{'-leave-active'}) {
        transition-duration: 0.7s;
    }

    & :global(.split-word-letter) {
        --font-weight: 100;
        --font-italic: 0;

        display: inline-block;
        letter-spacing: rem(10);
        opacity: 0;
        scale: 0.8;
        transform-origin: top center;
        transition: font-variation-settings, opacity, translate, scale;
        transition-delay: calc(var(--letter-index) * 100ms);
        transition-duration: 0.5s, 0.3s;
        transition-timing-function: ease(out-quad);
        translate: 0 -40px;
    }

    .root--animating & :global(.split-word-letter) {
        opacity: 1;
        scale: 1;
        transition-duration: 0.5s, 0.5s;
        translate: 0 0;

        --font-weight: 900;
        --font-italic: 7;
    }
}

.slider {
    position: relative;
    width: $slider-width;
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

    .root--leave &::after,
    .root--animating &::after {
        translate: calc($slider-width - 100%) 0;
    }

    &:global(#{'-enter-active'}) {
        transition-delay: 0.3s;
    }
}

.slider,
.tagline {
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition-duration: 0.7s;
        transition-property: opacity, translate;
    }

    &:global(#{'-leave-active'}) {
        transition-duration: 0.5s;
    }

    &:global(#{'-enter'}),
    &:global(#{'-leave-to'}) {
        opacity: 0;
        translate: 0 10px;
    }
}

.tagline {
    --v-button-label-font-weight: 350;

    width: min-content;
    margin-top: rem(45);
    font-style: italic;
    margin-inline: auto;
}
</style>
