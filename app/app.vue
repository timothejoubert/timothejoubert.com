<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-document'

const { document } = await useFetchPage(undefined)
const currentPage = useCurrentPage()

const currentPageType = computed(() => currentPage.value.document?.type)
const isProjectDocument = computed(() => currentPageType.value === prismicDocumentType.PROJECT_PAGE)

const documentWithProjectsListing = [
	prismicDocumentType.HOME_PAGE,
	prismicDocumentType.PROJECT_LISTING_PAGE,
	prismicDocumentType.PROJECT_PAGE,
]
const displayProjects = computed(() => {
	return documentWithProjectsListing.some(type => type === currentPageType.value)
})
</script>

<template>
    <div :class="$style.root">
        <NuxtRouteAnnouncer />
        <VNavBar :class="$style.nav" />
        <NuxtPage :class="[$style.page, isProjectDocument && $style['page--project']]" />

        <LazyVProjectListing
            v-if="displayProjects"
            :document="document"
            :class="$style.projects"
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
    --app-inner-max-height: calc(100svh - var(--app-padding) * 4);

    position: relative;
    display: grid;
    min-height: var(--app-max-height);
    max-height: var(--app-max-height);

	// padding-block: calc(var(--app-padding));
	border-radius: 8px;
    margin: calc(var(--app-padding));
	background-color: var(--color-surface);
    grid-template-columns: 1fr 1fr;
    grid-template-rows: min-content;
    overflow-y: auto;
    scrollbar-width: none;

    --overlay-color: var(--color-surface);

    // --overlay-color: red;
    --overlay-height: 40px;

    &::after {
        position: fixed;
        z-index: 11;
        border-radius: inherit;
        background: linear-gradient(to bottom,
            color-mix(in hsl, var(--overlay-color), transparent 10%) 10px,
            color-mix(in hsl, var(--overlay-color), transparent 100%) calc(var(--overlay-height)),
            color-mix(in hsl, var(--overlay-color), transparent 100%) calc(100% - var(--overlay-height)),
            color-mix(in hsl, var(--overlay-color), transparent 10%) calc(100% - 10px)
        );
        content: '';

        // background: linear-gradient(to bottom,
        //     color-mix(in hsl, var(--overlay-color), transparent 100%) calc(var(--overlay-height)),
        //     color-mix(in hsl, var(--overlay-color), transparent 100%) calc(100% - var(--overlay-height)),
        //     color-mix(in hsl, var(--overlay-color), transparent 10%) calc(100% - 10px)
        // );
        inset: calc(var(--app-padding));
        pointer-events: none;
    }
}

.grid,
.nav,
.projects
{
    grid-column: 1 / -1;
    grid-row: 1 / 2;
}

.nav {
    position: fixed;
    z-index: 1001;
    bottom: calc(var(--app-padding) + 12px);
    place-self: flex-end center;
}

.page {
    grid-column: 1 / -1;

    &--project {
        align-self: center;
        grid-column: 2 / -1;
        grid-row: 1;
    }
}

.projects {
    position: sticky;
    top: 0;
    height: min-content;
}
</style>
