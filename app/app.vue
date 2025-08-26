<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-document'

const { data: projects } = await usePrismicFetchProjects(true)

await useFetchPage(undefined)
const currentPage = useCurrentPage()
const pageType = computed(() => currentPage.value.document?.type)

const isProjectPage = computed(() => pageType.value === prismicDocumentType.PROJECT_PAGE)
const displayProjects = computed(() => {
	return pageType.value === prismicDocumentType.HOME_PAGE
	    || pageType.value === prismicDocumentType.PROJECT_LISTING_PAGE
	    || isProjectPage.value
})
</script>

<template>
    <div :class="$style.root">
        <NuxtRouteAnnouncer />
        <VNavBar :class="$style.nav" />
        <NuxtPage :class="[$style.page, isProjectPage && $style['page--project']]" />
        <VProjectListing
            v-if="projects?.length && displayProjects"
            :class="$style.projects"
            :projects="projects"
        />
        <DevOnly>
            <VGridVisualizer :class="$style.grid" />
        </DevOnly>
    </div>
</template>

<style lang="scss" module>
.root {
    --app-padding: 16px;
    --app-max-height: calc(100svh - var(--app-padding) * 2);

    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: min-content;
    min-height: var(--app-max-height);
    max-height: var(--app-max-height);
    margin: calc(var(--app-padding));
	// padding-block: calc(var(--app-padding));
	border-radius: 8px;
	background-color: var(--color-surface);
    overflow: hidden;
    overflow-y: auto;
    // scrollbar-width: none;

    --overlay-color: red;
    --overlay-color: var(--color-surface);
    --overlay-height: 40px;

    &::after {
        border-radius: inherit;
        position: fixed;
        content: '';
        // background: linear-gradient(to bottom,
        //     color-mix(in hsl, var(--overlay-color), transparent 10%) 10px,
        //     color-mix(in hsl, var(--overlay-color), transparent 100%) calc(var(--overlay-height)),
        //     color-mix(in hsl, var(--overlay-color), transparent 100%) calc(100% - var(--overlay-height)),
        //     color-mix(in hsl, var(--overlay-color), transparent 10%) calc(100% - 10px)
        // );
        background: linear-gradient(to bottom,
            color-mix(in hsl, var(--overlay-color), transparent 100%) calc(var(--overlay-height)),
            color-mix(in hsl, var(--overlay-color), transparent 100%) calc(100% - var(--overlay-height)),
            color-mix(in hsl, var(--overlay-color), transparent 10%) calc(100% - 10px)
        );
        inset: calc(var(--app-padding));
        z-index: 101;
        pointer-events: none;
    }
}

.grid,
.nav,
.page,
.projects
{
    grid-column: 1 / -1;
    grid-row: 1 / 3;
}

.nav {
    position: fixed;
    z-index: 102;
    align-self: flex-end;
    justify-self: center;
    bottom: calc(var(--app-padding) + 12px);
}

.page {
    z-index: 11;

    &--project {
        grid-column: 2 / -1;
    }
}

.projects {
    position: absolute;
    height: min-content;
    inset: 0;
    padding-block: var(--gutter);
}
</style>
