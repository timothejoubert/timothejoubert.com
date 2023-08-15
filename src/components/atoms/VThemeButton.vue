<template>
    <component
        :is="id ? 'button' : 'div'"
        :class="[$style.root, isSelected && $style['root--selected']]"
        @click="$emit('click', id)"
    >
        <span v-for="(color, i) in colors" :key="i" :class="$style.color" :style="{ backgroundColor: color }"></span>
    </component>
</template>
<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

export default Vue.extend({
    name: 'VThemeButton',
    props: {
        colors: Array as PropType<string[]>,
        id: String,
        isSelected: Boolean,
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    width: rem(42);
    height: rem(42);
    align-items: center;
    justify-content: center;
}

.color {
    position: absolute;
    display: block;
    width: rem(15);
    height: rem(15);
    border-radius: 100%;

    &::before,
    &::after {
        position: absolute;
        border: 2px solid var(--theme-background-color);
        border-radius: 100%;
        content: '';
        inset: -2px;
    }

    .root--selected &::after {
        border-color: var(--theme-foreground-color);
        opacity: 0.5;
    }

    &:first-child {
        // FOREGROUND
        z-index: 1;
        translate: 0 rem(-6);
    }

    &:nth-child(2) {
        // BG
        translate: rem(-6) rem(6);
    }

    &:nth-child(3) {
        // ACCENT
        translate: rem(6) rem(6);
    }
}
</style>
