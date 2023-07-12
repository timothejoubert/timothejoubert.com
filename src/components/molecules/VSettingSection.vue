<template>
    <div :class="$style.root">
        <div :class="$style.head" class="text-over-title-xs">
            <span :class="$style.title">{{ title }}</span>
            <button v-if="hasReset" :class="$style.reset" @click="$emit('onResetClicked')">Reset</button>
        </div>
        <slot name="default" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VSettingSection',
    props: {
        title: String,
        hasReset: { type: Boolean, default: true },
    },
    methods: {},
})
</script>
<style lang="scss" module>
.root {
    //width: calc(50% - #{rem(20)});
    //
    //@include media-container('<vl') {
    //    width: 100%;
    //}
    flex-grow: 1;
}

.head {
    display: flex;
    margin-bottom: rem(30);
    font-weight: 550 !important;
}

.title {
    padding: rem(4) rem(24);
    background-color: var(--theme-foreground-color);
    color: var(--theme-background-color);
}

.reset {
    padding: rem(3) rem(16);
    background-color: var(--theme-accent-color);
    color: var(--theme-background-color);
    font-size: rem(13);
    font-weight: 500;
}
</style>
