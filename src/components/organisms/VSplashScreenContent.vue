<template>
    <div :class="rootClass">
        <div :class="$style.center">
            <v-quick-loader :class="[$style['quick-loader'], quickLoaderVisible && ['quick-loader--enabled']]" />
            <transition
                :name="$style.title"
                @after-enter="onLettersAfterEnter"
                @before-leave="onLettersBeforeLeave"
                @after-leave="onLettersAfterLeave"
            >
                <v-split-words
                    v-if="isMainElementVisible"
                    ref="word"
                    :class="$style.title"
                    class="text-h1"
                    content="tim"
                />
            </transition>
            <transition :name="$style.slider">
                <div v-if="isSecondaryElementVisible" :class="$style.slider"></div>
            </transition>
            <transition :name="$style.tagline" @after-enter="onSliderEnterDone">
                <v-button
                    v-if="isSecondaryElementVisible"
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
import { SplashScreenState } from '~/components/organisms/VSplashScreen.vue'
import toBoolean from '~/utils/to-boolean'
import { STORAGE_KEY } from '~/mixins/SplashScreen'

// ORDER
// appear: secondary element enter => trigger: afterEnter
// animating: main element enter => trigger: afterEnter
// beforeLeave: main element start leaving => trigger: beforeLeave && AfterLeave
// leave: trigger AfterLeave
// done: remove wrapper component

export default Vue.extend({
    name: 'VSplashScreenContent',
    props: {
        value: String as PropType<SplashScreenState>,
    },
    data() {
        return {
            quickLoaderVisible: false,
        }
    },
    computed: {
        rootClass(): (string | undefined | false)[] {
            return [
                this.$style.root,
                this.value === 'appear' && this.$style['root--appear'],
                this.value === 'animating' && this.$style['root--animating'],
                this.value === 'beforeLeave' && this.$style['root--before-leave'],
                this.value === 'leave' && this.$style['root--leave'],
            ]
        },
        isMainElementVisible() {
            return this.value !== 'pending' && this.value !== 'beforeLeave'
        },
        isSecondaryElementVisible() {
            return this.value !== 'pending' && this.value !== 'beforeLeave'
        },
    },
    mounted() {
        this.quickLoaderVisible = toBoolean(sessionStorage.getItem(STORAGE_KEY))
    },
    methods: {
        onSliderEnterDone() {
            this.$emit('input', 'animating')
        },
        onLettersAfterEnter() {
            window.setTimeout(() => {
                this.$emit('input', 'beforeLeave')
            }, 1000)
        },
        onLettersBeforeLeave() {
            // this.$emit('input', 'leave')
        },
        onLettersAfterLeave() {
            this.$emit('input', 'done')
        },
    },
})
</script>

<style lang="scss" module>
$slider-width: clamp(rem(260), 27vw, rem(450)); //rem(360);

.root {
    position: fixed;
    z-index: 1002;
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
        // enter transition
        transition-delay: 0.75s;
        transition-duration: 3s;
        transition-property: scale;
        transition-timing-function: ease(out-quart);
    }

    &--appear::after,
    &--animating::after {
        scale: 0.974 0.974;
    }

    &--before-leave::after {
        // leave transition
        scale: 1.032;
        transition-delay: 0s;
        transition-duration: 0.9s;
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

    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        // transition after-enter not working for nested child like .split-word-letter
        transition-duration: 1.6s;
        transition-property: opacity;
        transition-timing-function: ease(out-quad);
    }

    &:global(#{'-leave-active'}) {
        transition-duration: 1s;
        transition-timing-function: ease(out-quart);
    }

    & :global(.split-word-letter) {
        --font-weight: 100;
        --font-italic: 0;

        display: inline-block;
        letter-spacing: rem(10);
        opacity: 0;
        scale: 0.8;
        transform-origin: top center;
        // leave transition
        transition: font-variation-settings, opacity, translate, scale;
        transition-delay: calc(var(--letter-index) * 70ms);
        transition-duration: 0.75s;
        transition-timing-function: ease(out-quart);
        translate: 0 -40px;
    }

    .root--animating & :global(.split-word-letter) {
        opacity: 1;
        scale: 1;
        transition-delay: calc(var(--letter-index) * 100ms);
        // enter transition
        transition-duration: 1s;
        transition-timing-function: ease(out-quad);
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
    margin-inline: auto;

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

    .root--animating &::after,
    .root--before-leave &::after,
    .root--leave &::after {
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
        transition-duration: 0.8s;
        transition-timing-function: ease(out-quart);
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

.quick-loader {
    opacity: 0;
    pointer-events: none;
    //transition: opacity 0.3s;
    translate: -50% 0;

    &--enabled {
        opacity: 1;
    }
}
</style>
