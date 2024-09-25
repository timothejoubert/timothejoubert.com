<script lang="ts" setup>
const { data: projectListingResponse } = usePrismicFetchDocuments('project')

const projects = computed(() => projectListingResponse.value.results)
</script>

<template>
    <div :class="$style.root">
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
