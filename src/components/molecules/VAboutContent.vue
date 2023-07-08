<template>
    <div :class="$style.root">about</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { SettingsDocument } from '~~/prismicio-types'

export default Vue.extend({
    name: 'VAboutContent',
    computed: {
        settings(): SettingsDocument {
            return this.$store.getters.settings
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
