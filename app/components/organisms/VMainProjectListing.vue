<script lang="ts" setup>
const { data: projects } = await usePrismicFetchProjects(true)
</script>

<template>
    <ul
        v-if="projects?.length"
        class="grid"
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

    height: min-content;
    margin-block: initial;
    padding-inline: initial;
    row-gap: var(--gutter);
}

.item {
    grid-column: 1 / -1;
    list-style: none;

    @include media('>=md') {
        grid-column: auto / span 4;
    }

    @include media('>=lg') {
        grid-column: auto / span 3;
    }
}
</style>
