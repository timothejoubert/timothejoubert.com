<script lang="ts" setup>
import { joinURL } from 'ufo'
import { getRoutePath } from '~~/shared/prismic-schema'
import { ensureProtocol } from '~/utils/url'

const { data: projects } = await usePrismicFetchProjects(true)

const { phase } = usePageIntro()
const pageRevealed = computed(() => phase.value === 'page' || phase.value === 'done')

const { site } = useRuntimeConfig().public
if (projects.value?.length) {
    useSchemaOrg([
        defineItemList({
            itemListElement: projects.value.map((project, index) => ({
                position: index + 1,
                name: project.data.title,
                url: joinURL(ensureProtocol(site.url), getRoutePath('projet', { uid: project.uid })),
            })),
        }),
    ])
}
</script>

<template>
    <ul
        v-if="projects?.length"
        :class="$style.root"
    >
        <LazyVProjectCard
            v-for="(project, index) in projects"
            :key="project.uid"
            wrapper="li"
            :project="project"
            :class="[$style.item, pageRevealed && $style['item--visible']]"
            :style="{ '--item-index': index }"
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
    opacity: 0;
    outline: 1PX solid transparent;
    transition:
        opacity 0.5s calc(var(--item-index, 0) * 30ms) ease(out-quad),
        translate 0.5s calc(var(--item-index, 0) * 30ms) ease(out-quad),
        outline 0.2s ease(out-quad);
    translate: 0 24px;

    &:has([aria-current="page"]) {
        outline-color: var(--color-accent);
    }

    @include media('>=md') {
        grid-column: auto;
    }



    &--visible {
        opacity: 1;
        translate: 0 0;
    }
}
</style>
