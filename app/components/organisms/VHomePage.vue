<script lang="ts" setup>
import type { HomePageDocument } from '~~/prismicio-types'

defineProps<{
	document: HomePageDocument
}>()

const { data: projects } = await usePrismicFetchProjects(true)
</script>

<template>
    <VProjectList
        v-if="projects?.length"
        :projects="projects"
    />
</template>
