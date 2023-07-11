<template>
    <input type="range" :value="value" :min="min" :step="step" :max="max" :class="$style.slider" @input="onUpdate" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VSlider',
    props: {
        value: { type: String, default: '1' },
        min: { type: String, default: '0' },
        max: { type: String, default: '100' },
        step: { type: String, default: '1' },
    },
    watch: {
        maxRange() {
            const value = (this.$refs.slider as HTMLInputElement).value
            this.$emit('updateMaxRange', value)
        },
    },
    methods: {
        onUpdate(event: InputEvent) {
            this.$emit('input', (event.target as HTMLInputElement).value)
        },
    },
})
</script>

<style lang="scss" module>
.slider {
    width: 80%;
    accent-color: var(--theme-foreground-color);
    -webkit-appearance: none;
    background-color: transparent;

    &::-webkit-slider-runnable-track {
        height: 2px;
        -webkit-appearance: none;
        background-color: var(--theme-foreground-color);
        //border: none;
        //border-radius: 5px;
        //outline: none;
    }

    &::-webkit-slider-thumb {
        width: rem(14);
        height: rem(14);
        -webkit-appearance: none;
        background-color: var(--theme-foreground-color);
        border-radius: 100%;
        transform: translateY(calc(-50% + 1px));
    }

    &::-moz-range-thumb {
        -webkit-appearance: none;
        //height: 30px;
        //-webkit-appearance: none;
    }
}
</style>
