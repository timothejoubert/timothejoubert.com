<template>
    <div
        :class="[$style.root, isExpanded && $style['root--expanded']]"
        @mouseenter="isExpanded = true"
        @mouseleave="isExpanded = false"
    >
        <div :class="$style.search"></div>
        <input
            :class="$style.input"
            type="text"
            name="search"
            placeholder="Nom du projet..."
            :value="value"
            class="text-body-xs"
            @input="onInput"
            @keyup.esc="clear"
        />
        <button :inert="!value.length" :class="$style.clear" name="Effacer la recherche" @click="clear">
            <span :class="$style['clear__bg']"></span>
        </button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VSearchInput',
    props: {
        value: { type: String, required: true },
    },
    data() {
        return {
            isExpanded: false,
            text: this.value,
        }
    },
    methods: {
        onInput(event: Event) {
            this.text = (event.target as HTMLInputElement).value
            this.$emit('input', this.text)
        },
        clear() {
            this.text = ''
            this.$emit('input', this.text)
        },
    },
})
</script>

<style lang="scss" module>
@use 'sass:math';

$expand-width: rem(140);
$clear-width: rem(17);

.root {
    position: relative;
    display: flex;
    width: rem(38);
    align-items: center;
    justify-content: center;
    transition: width 0.4s ease(out-quad);

    &--expanded {
        width: $expand-width;
    }
}

.search {
    position: absolute;
    width: rem(15);
    aspect-ratio: 1;
    opacity: 0.5;
    transition: translate 0.4s ease(out-quad);

    &::before,
    &::after {
        position: absolute;
        content: '';
    }

    .root--expanded & {
        translate: calc(#{math.div($expand-width, 2) * -1} - 100%) 0;
    }

    &::before {
        width: 85%;
        border: 1px solid var(--theme-foreground-color);
        aspect-ratio: 1;
        border-radius: 100%;
    }

    &::after {
        right: 0;
        bottom: 0;
        width: 35%;
        height: 1px;
        background-color: var(--theme-foreground-color);
        rotate: 45deg;
        transform-origin: right center;
    }
}

.input {
    all: unset;
    position: absolute;
    width: 100%;
    max-width: rem(24);
    opacity: 0;
    padding-inline: rem(6);
    transition: 0.4s ease(out-quad);
    transition-property: translate, opacity, max-width;

    &[type='text'] {
        @include text-body-xs;
    }

    &::placeholder {
        opacity: 0.7;
    }

    .root--expanded & {
        max-width: calc(100% - $clear-width * 2);
        opacity: 0.5;
        translate: -$clear-width 0;
    }
}

.clear {
    position: absolute;
    right: 0;
    display: flex;
    overflow: hidden;
    width: $clear-width;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border-radius: 100%;
    visibility: hidden;

    .root--expanded &:not([inert]) {
        visibility: visible;
    }

    &::before,
    &::after {
        position: absolute;
        z-index: 1;
        width: rem(8);
        height: 1px;
        background-color: var(--theme-background-color);
        content: '';
        transform-origin: center;
    }

    &::before {
        rotate: 45deg;
    }

    &::after {
        rotate: -45deg;
    }
}

.clear__bg {
    width: 100%;
    height: 100%;
    background-color: var(--theme-foreground-color);
    opacity: 0.5;
}
</style>
