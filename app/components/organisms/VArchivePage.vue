<script lang="ts" setup>
import type { ArchiveDocument } from '~~/prismicio-types';

const props = defineProps<{
    document: ArchiveDocument
}>()

const { data: projects } = await usePrismicFetchProjects(false, {
    graphQuery: `
        {
            project {
                title
                date
                rate
                tag_group
                framework
            }
        }`,
})
</script>
<template>
    <div>
        <h1>Archive page | {{ document.data.title }}</h1>
        <ul>
            <li v-for="project in projects" :key="project.id">
                <VProjectRow :project="project" />
            </li>
        </ul>
    </div>
</template>
<style lang="scss" module>
</style>
