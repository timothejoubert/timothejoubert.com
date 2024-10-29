<script lang="ts" setup>
import type { ProjectDocument, ProjectListingPageDocument } from '~/prismicio-types'

defineProps<{
    document: ProjectListingPageDocument
}>()

const prismicFilter = usePrismic().filter
const fetchListing = await usePrismicFetchDocuments<ProjectDocument>('project', {
    orderings: {
        field: 'my.project.date',
        direction: 'desc',
    },
    filters: [prismicFilter.at('my.project.favorite', true)],
})

const isPending = computed(() => fetchListing.status.value === 'pending')
const projects = computed(() => fetchListing.data.value?.results || [])
</script>

<template>
    <div :class="$style.root">
        <h1>Project listing page | isPending: {{ isPending }}</h1>
        <ol
            v-if="projects.length"
            :class="$style.list"
        >
            <li
                v-for="(project, index) in projects"
                :key="project?.uid || index"
            >
                <VProjectCard
                    :project="project"
                    :skeleton="isPending"
                />
            </li>
        </ol>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}

.list {
    --v-project-listing-page-columns: 4;
    display: grid;
    grid-template-columns: repeat(var(--v-project-listing-page-columns), minmax(0 , 1fr));
    gap: rem(24);
}
</style>
