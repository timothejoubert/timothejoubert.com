<template>
    <label class="text-body-xs" :class="$style.root">
        <input
            :type="multiple ? 'checkbox' : 'radio'"
            :name="!multiple && id"
            :checked="isActive"
            :value="value"
            :class="$style.input"
            @input="onClick"
        />
        <span :class="$style.checkbox">
            <icon-check :class="$style.icon" />
        </span>
        <span :class="$style.label__text">{{ label }}</span>
    </label>
</template>

<script lang="ts">
import Vue from 'vue'
import IconCheck from '~/assets/images/icons/check.svg?sprite'

export default Vue.extend({
    name: 'VCheckbox',
    components: { IconCheck },
    props: {
        id: String,
        multiple: Boolean,
        isActive: Boolean,
        value: { type: String, required: true },
        label: { type: String, required: true },
    },
    methods: {
        onClick() {
            this.$emit('input', this.value)
        },
    },
})
</script>

<style lang="scss" module>
$check-border-width: 2px;

.root {
    position: relative;
    display: flex;
    width: fit-content;
    align-items: center;
    cursor: pointer;
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
