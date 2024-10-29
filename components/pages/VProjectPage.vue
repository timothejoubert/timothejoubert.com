<script lang="ts" setup>
import type { ProjectDocument } from '~/prismicio-types'

defineProps<{
    document: ProjectDocument
}>()
</script>

<template>
    <div :class="$style.root">
        <h1>Project page</h1>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
