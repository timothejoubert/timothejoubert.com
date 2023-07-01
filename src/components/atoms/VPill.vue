<template>
    <div :class="classNames">
        <slot>{{ label }}</slot>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import type { PropType } from 'vue'
import { Theme } from '~/types/app'
import { VButtonSize } from '~/components/molecules/VButton.vue'

export default Vue.extend({
    name: 'VPill',
    props: {
        filled: Boolean,
        label: [String, Boolean, Object] as PropType<string | false | VueI18n.TranslateResult>,
        size: [String, Boolean] as PropType<VButtonSize | false>,
        rounded: {
            type: Boolean,
            default: true,
        },
        outlined: Boolean,
        theme: { type: String as PropType<Theme>, default: 'dark' },
    },
    computed: {
        classNames(): (string | boolean | undefined)[] {
            return [
                this.$style.root,
                this.$style[`root--theme-${this.theme}`],
                typeof this.size === 'string' && this.$style['root--size-' + this.size],
                this.outlined && this.$style['root--outlined'],
                this.filled && this.$style['root--filled'],
                this.rounded && this.$style['root--rounded'],
            ]
        },
    },
})
</script>

<style lang="scss" module>
@use 'sass:math';

.root {
    @include v-button-default-css-vars($v-button);
    @include theme-variants;

    @include v-button-default-css-vars($v-button-inner, 'inner');

    align-items: center;
    justify-content: center;
    border: none;
    color: color(black);
    text-decoration: none;
    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
    white-space: nowrap;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &--rounded {
        @include v-button-default-css-vars($v-button-rounded, 'rounded');
    }

    &--outlined {
        border-color: var(--v-button-border-color, currentColor);
    }

    &--filled {
        background-color: var(--theme-background-color);
        color: var(--theme-foreground-color);
    }

    &--disabled {
        color: color(grey-50);
        pointer-events: none; // prevents click on disabled link (<a> or <nuxt-link>)
    }

    &--outlined#{&}--disabled {
        background-color: transparent;
    }

    &--filled#{&}--disabled {
        background-color: color(grey-50);
    }

    // SIZES

    @each $key, $value in $v-button {
        &--size-#{$key} {
            @include v-button-size($key);
        }
    }
}
</style>
