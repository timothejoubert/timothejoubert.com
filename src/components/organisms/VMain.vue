<template>
    <div :class="[$style.root, isOpen && isOpen && $style['root--open']]">
        <v-settings :class="$style.settings" />
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
