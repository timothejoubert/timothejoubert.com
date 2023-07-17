<template>
    <div :class="$style.root">
        <v-checkbox
            v-for="option in options"
            :id="id"
            :key="option.value"
            :value="option.value"
            :label="option.label"
            :type="type"
            :is-active="activeValues.includes(option.value)"
            :class="$style.checkbox"
            @input="(value) => $emit('input', value)"
        />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { VCheckboxType } from '~/components/atoms/VCheckbox.vue'

export default Vue.extend({
    name: 'VSelect',
    props: {
        id: String,
        label: String,
        type: String as PropType<VCheckboxType>,
        activeValues: Array as PropType<String[]>,
        options: { type: Array as PropType<{ value: string; label: string }[]>, default: () => [] },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: rem(3);
}
</style>
