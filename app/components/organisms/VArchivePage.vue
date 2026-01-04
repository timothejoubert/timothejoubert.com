<script lang="ts" setup>
import type { ArchiveDocument } from '~~/prismicio-types'

defineProps<{
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
    <div :class="$style.root">
        <h1>{{ document.data.title || 'Archive page' }}</h1>
        <ul
            v-if="projects?.length"
            :class="$style.list"
        >
            <li
                v-for="project in projects"
                :key="project.id"
                :class="$style.item"
            >
                <LazyVProjectRow :project="project" />
            </li>
        </ul>
    </div>
</template>

<style lang="scss" module>
.root {
    width: 100%;
}

.list {
    padding: 0;
    margin: 0;
    list-style: none;
}

.item {

}
</style>
