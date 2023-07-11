<template>
    <div :class="[$style.root, isOpen && isOpen && $style['root--open']]">
        <v-setting :class="$style.settings" :inert="!isOpen" />
        <v-project-list />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VMain',
    computed: {
        isOpen() {
            return this.$store.state.isSettingsOpen
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    min-height: calc(100vh - $v-top-bar-height - $v-about-toggle-height);
    /* stylelint-disable-next-line property-no-unknown */
    container-type: inline-size;
    transition: translate 0.4s ease(out-quad);
    translate: 0 $v-settings-height * -1;

    &--open {
        translate: 0;
    }
}

.settings {
    .root--open & {
        position: sticky;
        top: $v-top-bar-height;
    }
}
</style>
