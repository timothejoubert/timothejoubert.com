<template>
    <component :is="tag" :class="rootClasses" @click="$emit('click', id)">
        <template v-if="isInputs">
            <div v-for="(color, inputIndex) in colors" :key="'input-' + inputIndex" :class="$style.color">
                <input type="color" :class="$style.input" @input="onColorInputUpdate($event, inputIndex)" />
            </div>
        </template>
        <template v-else>
            <span
                v-for="(color, i) in colors"
                :key="i"
                :class="$style.color"
                :style="!isInputs && { backgroundColor: color }"
            ></span>
        </template>
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
        isInputs: Boolean,
        wrapperTag: String,
        isExpanded: Boolean,
    },
    computed: {
        rootClasses(): (undefined | false | string)[] {
            return [
                this.$style.root,
                this.tag === 'button' && this.$style['root--button'],
                this.isInputs && this.$style['root--inputs'],
                this.isExpanded && this.$style['root--expanded'],
                this.isSelected && this.$style['root--selected'],
            ]
        },
        tag() {
            return this.wrapperTag || (this.isInputs ? 'div' : 'button')
        },
    },
    methods: {
        onColorInputUpdate(_event: Event, _index: number) {
            // console.log('update input', event, index)
        },
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

    &--inputs {
        min-width: rem(100);
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

    .root--inputs.root--expanded &::after,
    .root--selected &::after {
        border-color: var(--theme-foreground-color);
        opacity: 0.5;
    }

    // FOREGROUND
    &:first-child {
        z-index: 1;
        translate: 0 rem(-6);
    }

    .root--inputs &:first-child {
        background-color: var(--theme-foreground-color);
    }

    .root--inputs.root--expanded &:first-child {
        translate: 0 0;
    }

    // BG
    &:nth-child(2) {
        translate: rem(-6) rem(6);
    }

    .root--inputs &:nth-child(2) {
        background-color: var(--theme-background-color);
    }

    .root--inputs.root--expanded &:nth-child(2) {
        translate: rem(-28) 0;
    }

    // ACCENT
    &:nth-child(3) {
        translate: rem(6) rem(6);
    }

    .root--inputs &:nth-child(3) {
        background-color: var(--theme-accent-color);
    }

    .root--inputs.root--expanded &:nth-child(3) {
        translate: rem(28) 0;
    }

    @media (hover: hover) {
        .root--button:hover &:nth-child(1) {
            scale: 1.05;
            translate: 0 rem(-7);
        }
        .root--button:hover &:nth-child(2) {
            scale: 1.05;
            translate: rem(-7) rem(7);
        }

        .root--button:hover &:nth-child(3) {
            scale: 1.05;
            translate: rem(7) rem(7);
        }
    }
}

.input {
    all: unset;
    position: absolute;
    z-index: 8;
    inset: -4px;
    opacity: 0;
}
</style>
