<script lang="ts" setup>
const { data: projects } = await usePrismicFetchProjects(true)
</script>

<template>
    <ul
        v-if="projects?.length"
        :class="$style.root"
    >
        <LazyVProjectCard
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
    --grid-container-width: 100%;

    display: grid;
    height: min-content;
    gap: var(--gutter);
    grid-template-columns: minmax(0, 1fr);
    margin-block: initial;
    padding-inline: initial;

    @include grid-container;

    @include media('>=md') {
        grid-template-columns: repeat(var(--v-home-grid-columns, 4), minmax(0, 1fr));
    }
}

.item {
    grid-column: 1 / -1;
    list-style: none;

    @include media('>=md') {
        grid-column: auto;
    }
}
</style>
