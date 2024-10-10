<script lang="ts" setup>
// import { usePrismic } from '@prismicio/vue'
import type { ProjectListingPageDocument } from '~/prismicio-types'

defineProps<{
    prismicDocument: ProjectListingPageDocument
}>()

// TODO: find how to filter project by field value
// const prismicFilter = usePrismic().filter
// const filters = prismicFilter.at('my.project.favorite', true)

const { data: projectListingResponse } = usePrismicFetchDocuments('project', {
    orderings: {
        field: 'my.project.date',
        direction: 'desc',
    },
    filters: ['at(my.project.favorite, true)'],
    pageSize: 10, // default 20
})
const projects = computed(() => projectListingResponse.value.results || [])

console.log('projects', projects.value)
</script>

<template>
    <div :class="$style.root">
        <h1>Project listing page</h1>
        <ol
            v-if="projects.length"
            :class="$style.list"
        >
            <li
                v-for="project in projects"
                :key="project.uid"
            >
                <VProjectCard
                    :project="project"
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
