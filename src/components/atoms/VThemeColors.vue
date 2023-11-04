<template>
    <component :is="tag || 'div'" :class="rootClasses">
        <span v-for="(color, i) in colors" :key="i" :class="$style.color" :style="{ backgroundColor: color }"></span>
    </component>
</template>
<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

export default Vue.extend({
    name: 'VThemeColors',
    props: {
        colors: Array as PropType<string[]>,
        isSelected: Boolean,
        tag: String,
        extended: Boolean,
    },
    computed: {
        rootClasses(): (undefined | false | string)[] {
            return [
                this.$style.root,
                this.extended && this.$style['root--extended'],
                this.isSelected && this.$style['root--selected'],
            ]
        },
    },
})
</script>
<style lang="scss" module>
$default-offset: rem(2);
$hover-offset: rem(4);

.root {
    position: relative;
    display: flex;
    width: var(--v-theme-colors-width, rem(42));
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
}

.color {
    position: absolute;
    display: block;
    width: rem(15);
    height: rem(15);
    border-radius: 100%;
    pointer-events: none;
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

    .root--extended &:nth-child(1) {
        translate: 0 (-$hover-offset);
    }

    // BG
    &:nth-child(2) {
        translate: -$default-offset $default-offset;
    }

    .root--extended &:nth-child(2) {
        translate: -$hover-offset $hover-offset;
    }

    // ACCENT
    &:nth-child(3) {
        translate: $default-offset $default-offset;
    }

    .root--extended &:nth-child(3) {
        translate: $hover-offset $hover-offset;
    }

    @media (hover: hover) {
        .root:hover &:nth-child(1) {
            //scale: 1.05;
            translate: 0 (-$hover-offset);
        }
        .root:hover &:nth-child(2) {
            //scale: 1.05;
            translate: (-$hover-offset) $hover-offset;
        }

        .root:hover &:nth-child(3) {
            //scale: 1.05;
            translate: $hover-offset $hover-offset;
        }
    }
}
</style>
