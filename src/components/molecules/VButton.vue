<template>
    <component
        :is="internalTag"
        :class="classNames"
        :disabled="internalTag === 'button' && disabled"
        v-bind="linkProps"
        @mouseenter="mouseEnter = true"
        @mouseleave="mouseEnter = false"
        @click="onClick"
    >
        <span v-if="hasIcon" ref="icon" :class="$style.icon">
            <slot name="icon" />
        </span>
        <span v-if="hasLabel" :class="$style.label">
            <slot>
                <v-slide-text
                    v-if="animate && typeof label === 'string'"
                    :play-animation="mouseEnter"
                    :content="label"
                />
                <template v-else>{{ label }}</template>
            </slot>
        </span>
    </component>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { Theme } from '~/types/app'

export type VButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'

function isRelativePath(path: string): boolean {
    return path.charAt(0) === '/'
}

function isAnchor(path: string): boolean {
    return path.charAt(0) === '#'
}

export default Vue.extend({
    name: 'VButton',
    props: {
        filled: Boolean,
        label: [String, Boolean, Object] as PropType<string | false>,
        size: [String, Boolean] as PropType<VButtonSize | false>,
        elevated: Boolean,
        rounded: {
            type: Boolean,
            default: true,
        },
        outlined: Boolean,
        disabled: Boolean,
        tag: [String, Boolean] as PropType<string | false>,
        href: [String, Boolean] as PropType<string | false>, // external (absolute) or internal (relative) link
        to: [String, Object, Boolean], // internal link (use NuxtLink)
        iconLast: {
            type: Boolean,
            default: true,
        },
        animate: Boolean,
        theme: { type: String as PropType<Theme>, default: 'dark' },
    },
    data() {
        return {
            mouseEnter: false,
        }
    },
    computed: {
        classNames(): (string | boolean | undefined)[] {
            return [
                this.$style.root,
                typeof this.size === 'string' && this.$style['root--size-' + this.size],
                this.outlined && this.$style['root--outlined'],
                this.filled && this.$style['root--filled'],
                this.elevated && this.$style['root--elevated'],
                this.disabled && this.$style['root--disabled'],
                this.rounded && this.$style['root--rounded'],
                this.hasIcon && this.$style['root--has-icon'],
                this.hasLabel && this.$style['root--has-label'],
                this.iconLast && this.$style['root--icon-last'],
                this.$style['root--theme-' + this.theme],
            ]
        },
        internalTag(): string {
            if (typeof this.tag === 'string') return this.tag

            if (this.to || (typeof this.href === 'string' && isRelativePath(this.href))) return 'nuxt-link'
            else if (this.href) return 'a'
            else return 'button'
        },
        hasIcon(): boolean {
            return !!this.$slots.icon || !!this.$scopedSlots.icon
        },
        hasLabel(): boolean {
            return !!this.$slots.default || !!this.$scopedSlots.default || !!this.label
        },
        linkProps(): Record<string, any> {
            const props: Record<string, any> = {}
            const localePath = this.$getLocalePath()

            if (this.to) {
                props.to = localePath + this.to
            } else if (typeof this.href === 'string' && isRelativePath(this.href)) {
                props.to = localePath + this.href
            } else if (this.href) {
                props.href = localePath + this.href
                if (!isAnchor(this.href)) props.target = '_blank'
            }

            return props
        },
    },
    methods: {
        onClick(event: MouseEvent) {
            this.$emit('click', event)
        },
    },
})
</script>

<style lang="scss" module>
@use 'sass:math';

.root {
    @include v-button-default-css-vars($v-button);
    //@include theme-variants;

    display: inline-flex;
    overflow: hidden;
    align-items: center;
    border: none;
    text-decoration: none;
    text-transform: uppercase;
    //color: var(--theme-foreground-color);
    //transition: background-color 0.3s, border-color 0.3s, color 0.3s;

    &--theme-light {
        color: var(--theme-foreground-color);
    }

    &--theme-dark {
        color: var(--theme-background-color);
    }

    &--theme-accent {
        color: var(--theme-background-color);
    }

    &--theme-light#{&}--filled {
        background-color: var(--theme-background-color);
    }

    &--theme-dark#{&}--filled {
        background-color: var(--theme-foreground-color);
    }

    &--theme-accent#{&}--filled {
        background-color: var(--theme-accent-color);
    }

    /* outlined */

    &--theme-light#{&}--outlined {
        border-color: var(--theme-background-color);
        color: var(--theme-background-color);
    }

    &--theme-dark#{&}--outlined {
        border-color: var(--theme-foreground-color);
        color: var(--theme-foreground-color);
    }

    &--theme-accent #{&}--outlined {
        border-color: var(--theme-accent-color);
        color: var(--theme-accent-color);
    }

    &:not(#{&}--has-icon) {
        justify-content: center;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &--rounded {
        @include v-button-default-css-vars($v-button-rounded, 'rounded');

        border-radius: rem(40);
    }

    &--outlined {
        border: 1px solid;
        border-color: var(--v-button-border-color, currentColor);
    }

    &--filled {
        min-width: var(--v-button-min-width);
        //background-color: var(--theme-background-color);
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

.icon {
    @include v-button-default-css-vars($v-button-icon, 'icon');

    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--v-button-icon-color, currentColor);
    line-height: 0;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    .root--icon-last & {
        order: 2;
    }

    .root--has-icon:not(.root--has-label) & {
        margin: 0;
    }
}

.label {
    @include v-button-default-css-vars($v-button-label, 'label');

    white-space: nowrap;
}
</style>
