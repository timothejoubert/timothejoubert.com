<template>
    <label class="text-body-xs" :class="[$style.root, type === 'switch' && $style['root--switch']]" :inert="isDisabled">
        <input
            :type="tag"
            :name="type === 'multiple' && id"
            :checked="isActive"
            :value="value"
            :class="$style.input"
            @input="onClick"
        />
        <span :class="$style.checkbox">
            <icon-check v-if="type !== 'switch'" :class="$style.icon" />
        </span>
        <span :class="$style.label__text">{{ label }}</span>
    </label>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import IconCheck from '~/assets/images/icons/check.svg?sprite'

export type VCheckboxType = 'multiple' | 'radio' | 'switch' | undefined

export default Vue.extend({
    name: 'VCheckbox',
    components: { IconCheck },
    props: {
        id: String,
        type: String as PropType<VCheckboxType>,
        isActive: Boolean,
        isDisabled: Boolean,
        value: { type: [String, Boolean] },
        label: { type: String, required: true },
    },
    computed: {
        tag(): 'checkbox' | 'radio' {
            return this.type === 'radio' || !this.type ? 'radio' : 'checkbox'
        },
    },
    methods: {
        onClick() {
            if (typeof this.value === 'boolean') {
                this.$emit('input', !this.value)
            } else {
                this.$emit('input', this.value)
            }
        },
    },
})
</script>

<style lang="scss" module>
@use 'sass:math';

$check-border-width: 2px;

.root {
    position: relative;
    display: flex;
    width: fit-content;
    align-items: center;
    cursor: pointer;

    &[inert] {
        opacity: 0.5;
        //color: #575656;
    }
}

.input {
    position: absolute;
    cursor: pointer;
    opacity: 0;
}

.label__text {
    padding-top: rem(2);
    white-space: nowrap;

    &::first-letter {
        text-transform: uppercase;
    }

    .input:focus-visible ~ & {
        text-decoration: underline;
    }

    .root[inert] & {
        text-decoration: line-through;
    }
}

.checkbox {
    position: relative;
    display: flex;
    width: rem(18);
    height: rem(18);
    align-items: center;
    justify-content: center;
    border: $check-border-width solid currentColor;
    margin-right: rem(14);
    color: inherit;

    :global(input):checked + & {
        background-color: currentColor;
    }

    :global(input)[type='radio'] + & {
        border-radius: 50%;
    }

    :global(input)[type='radio'] + &::after {
        width: 6px;
        height: 6px;
        background-color: var(--theme-background-color);
        border-radius: 50%;
        content: '';
    }

    .root--switch & {
        overflow: hidden;
        width: rem(40);
        height: rem(22);
        border-width: 1px;
        border-radius: 100vmax;
        transition: background-color 0.3s;

        &::before {
            position: absolute;
            left: rem(5);
            width: rem(12);
            height: rem(12);
            background-color: var(--theme-foreground-color);
            border-radius: math.div(rem(14), 2);
            content: '';
            transform-origin: left;
            transition: translate 0.3s, background-color 0.3s;
        }
    }

    .root--switch :global(input):checked + &::before {
        background-color: var(--theme-background-color);
        translate: 20px 0;
    }
}

.icon {
    $offset: rem(24 - 18 - $check-border-width * 0.5);

    position: absolute;
    top: -$offset;
    left: -$offset;
    color: var(--theme-background-color);
    visibility: hidden;

    :global(input)[type='checkbox']:checked + .checkbox & {
        visibility: inherit;
    }
}
</style>
