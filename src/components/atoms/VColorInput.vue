<template>
    <div :class="[$style.root, isFull && $style['root--full']]">
        <label :for="id" :class="$style.label">{{ label }}</label>
        <input :class="$style.input" type="color" @input="onUpdate" />
        <span :id="id" :class="$style.box" :style="{ backgroundColor: `var(--theme-${id}-color)` }"></span>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import MutationType from '~/constants/mutation-type'
import { ClientTheme } from '~/types/app'

export default Vue.extend({
    name: 'VColorInput',
    props: {
        label: String,
        id: String as PropType<keyof ClientTheme>,
    },
    computed: {
        isFull() {
            return !this.label
        },
    },
    methods: {
        onUpdate(event: InputEvent) {
            const value = (event.target as HTMLInputElement).value
            this.$store.commit(MutationType.CLIENT_THEME, { key: this.id, value })
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    display: inline-flex;
    min-width: rem(86);
    align-items: center;
    justify-content: center;
    padding: rem(6) rem(24);
    background-color: var(--theme-foreground-color);
    border-radius: 100vmax;
    color: var(--theme-background-color);
    cursor: pointer;

    &--full {
        overflow: hidden;
        min-width: rem(46);
        height: rem(20);
        padding: 0;
        border: 1px solid var(--theme-foreground-color);
        background-color: initial;
        color: initial;
    }
}

.label {
    //display: none;
    font-size: rem(12);
    font-weight: 500;
}

.input {
    all: unset;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 100%;
    padding: 0;
    border: none;
    appearance: none;
    opacity: 0;
    outline: none;
}

.box {
    display: inline-block;
    width: rem(13);
    height: rem(13);
    border: 1px solid var(--theme-background-color);
    margin-left: rem(8);

    .root--full & {
        width: 100%;
        height: 100%;
        border: none;
        margin: initial;
    }
}
</style>
