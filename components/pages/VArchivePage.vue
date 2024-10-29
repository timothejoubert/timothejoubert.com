<script lang="ts" setup>
import type { ArchiveDocument } from '~/prismicio-types'

defineProps<{
    document: ArchiveDocument
}>()
</script>

<template>
    <div :class="$style.root">
        <h1>Archive page</h1>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
