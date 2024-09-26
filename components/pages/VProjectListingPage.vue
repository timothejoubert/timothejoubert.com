<script lang="ts" setup>

import type { ProjectListingPageDocument } from "~/prismicio-types";

defineProps<{
    prismicDocument: ProjectListingPageDocument,
}>()
// const { data: projectListingResponse } = usePrismicFetchDocuments('project')

// const projects = computed(() => projectListingResponse.value.results || [])
const projects = []

</script>

<template>
    <div :class="$style.root">
        <h1>Project listing page</h1>
        <ol v-if="projects.length">
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
</style>
