<script lang="ts" setup>
import type { ProjectListingPageDocument } from '~~/prismicio-types'

defineProps<{
	document: ProjectListingPageDocument
}>()

const { data: projects } = await usePrismicFetchProjects(true)
</script>

<template>
    <VProjectList
        v-if="projects?.length"
        :projects="projects"
    />
</template>
