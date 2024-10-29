<script  lang="ts" setup>
import type { AboutDocument } from '~/prismicio-types'

defineProps<{
    document: AboutDocument
}>()
</script>

<template>
    <div :class="$style.root">
        <h1>About page</h1>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
