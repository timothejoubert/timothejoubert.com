<template>
    <div :class="$style.root">
        <label :for="id" :class="$style.label">{{ label }}</label>
        <select :id="id" :name="id" :class="$style.select" @input="onUpdate">
            <!--            <option value="">&#45;&#45;Please choose an option&#45;&#45;</option>-->
            <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

export default Vue.extend({
    name: 'VSelect',
    props: {
        id: String,
        label: String,
        options: Array as PropType<{ value: string; label: string }[]>,
    },
    methods: {
        onUpdate(event: Event) {
            this.$emit('input', (event.target as HTMLSelectElement).value)
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
}

.label {
    font-size: rem(12);
    font-weight: 500;
}

.select {
    position: absolute;
    inset: 0;
    opacity: 0;
}
</style>
