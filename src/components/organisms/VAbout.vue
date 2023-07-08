<template>
    <div :class="rootClasses" class="container">
        <v-about-toggle />
        <v-about-content v-show="isAboutOpen" :inert="!isAboutOpen" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VAbout',
    computed: {
        rootClasses(): (undefined | false | string)[] {
            return [this.$style.root, this.isAboutOpen && this.$style['root--open']]
        },
        commonContent() {
            return this.$store.state
        },
        isAboutOpen() {
            return this.$store.state.isAboutOpen
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: sticky;
    bottom: 0;
    min-height: $v-about-toggle-height;
    border-top: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
    transition: min-height 0.8s ease(out-quad);

    &--open {
        min-height: calc(100vh - $v-top-bar-height);
    }
}
</style>
