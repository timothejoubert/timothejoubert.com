<script lang="ts" setup>
import type { ProjectDocument } from '~~/prismicio-types'

defineProps<{
	projects: ProjectDocument[]
}>()
</script>

<template>
    <ul
        v-if="projects.length"
        class="grid"
        :class="$style.root"
    >
        <VProjectCard
            v-for="project in projects"
            :key="project.uid"
            wrapper="li"
            :project="project"
            :class="$style.item"
        />
    </ul>
</template>

<style lang="scss" module>
.root {
    position: relative;
    margin-block: initial;
    padding-inline: initial;
}

.item {
    grid-column: 1 / -1;
    list-style: none;

    @include media('>=md') {
        grid-column: auto / span 4;
    }

    @include media('>=lg') {
        grid-column: auto / span 6;
    }
}
</style>
