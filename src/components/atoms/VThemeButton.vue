<template>
    <component :is="tag" :class="rootClasses" @click="$emit('click', id)">
        <span v-for="(color, i) in colors" :key="i" :class="$style.color" :style="{ backgroundColor: color }"></span>
    </component>
</template>
<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

export default Vue.extend({
    name: 'VThemeButton',
    props: {
        id: { type: String, required: false },
        colors: Array as PropType<string[]>,
        isSelected: Boolean,
        wrapperTag: String,
    },
    computed: {
        rootClasses(): (undefined | false | string)[] {
            return [
                this.$style.root,
                this.tag === 'button' && this.$style['root--button'],
                this.isSelected && this.$style['root--selected'],
            ]
        },
        tag() {
            return this.wrapperTag || 'button'
        },
    },
})
</script>
<style lang="scss" module>
$default-offset: rem(2);
$hover-offset: rem(5);

.root {
    position: relative;
    display: flex;
    width: rem(42);
    height: rem(42);
    align-items: center;
    justify-content: center;

    &--inputs {
        min-width: rem(100);
    }

    &--button {
        /* !keep */
    }
}

.color {
    position: absolute;
    display: block;
    width: rem(15);
    height: rem(15);
    border-radius: 100%;
    transition: 0.3s ease(out-quad);
    transition-property: translate, scale;

    &::before,
    &::after {
        position: absolute;
        border: 2px solid var(--theme-background-color);
        border-radius: 100%;
        content: '';
        inset: -2px;
    }

    &::after {
        border-color: color(white);
        opacity: 0.1;
    }

    .root--selected &::after {
        border-color: var(--theme-foreground-color);
        opacity: 0.5;
    }

    // FOREGROUND
    &:nth-child(1) {
        z-index: 1;
        translate: 0 (-$default-offset);
    }

    .root--selected &:nth-child(1),
    .root:not(.root--button) &:nth-child(1) {
        translate: 0 (-$hover-offset);
    }

    // BG
    &:nth-child(2) {
        translate: -$default-offset $default-offset;
    }

    .root--selected &:nth-child(2),
    .root:not(.root--button) &:nth-child(2) {
        translate: -$hover-offset $hover-offset;
    }

    // ACCENT
    &:nth-child(3) {
        translate: $default-offset $default-offset;
    }

    .root--selected &:nth-child(3),
    .root:not(.root--button) &:nth-child(3) {
        translate: $hover-offset $hover-offset;
    }

    @media (hover: hover) {
        button.root:hover &:nth-child(1) {
            //scale: 1.05;
            translate: 0 (-$hover-offset);
        }
        button.root:hover &:nth-child(2) {
            //scale: 1.05;
            translate: (-$hover-offset) $hover-offset;
        }

        button.root:hover &:nth-child(3) {
            //scale: 1.05;
            translate: $hover-offset $hover-offset;
        }
    }
}
</style>
