<template>
    <div :class="$style.root">
        <v-checkbox
            v-for="option in options"
            :id="id"
            :key="option.value"
            :value="option.value"
            :label="option.label"
            :multiple="multiple"
            :is-active="activeValues.includes(option.value)"
            :class="$style.checkbox"
            @input="(value) => $emit('input', value)"
        />
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
        multiple: Boolean,
        activeValues: Array as PropType<String[]>,
        options: { type: Array as PropType<{ value: string; label: string }[]>, default: () => [] },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
}

.checkbox {
    margin-block: rem(3);
}
</style>
