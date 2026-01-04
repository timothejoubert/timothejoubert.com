<script lang="ts" setup>
import type { HomePageDocument } from '~~/prismicio-types'

defineProps<{
	document: HomePageDocument
}>()
</script>

<template>
    <VMainProjectListing />
</template>
