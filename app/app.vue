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
    grid-template-columns: 1fr 1fr;
    grid-template-rows: min-content;

    min-height: var(--app-max-height);
    max-height: var(--app-max-height);
    overflow-y: auto;

    margin: calc(var(--app-padding));
	// padding-block: calc(var(--app-padding));
	border-radius: 8px;
	background-color: var(--color-surface);

    scrollbar-width: none;

    --overlay-color: red;
    --overlay-color: var(--color-surface);
    --overlay-height: 40px;

    &::after {
        border-radius: inherit;
        position: fixed;
        content: '';
        background: linear-gradient(to bottom,
            color-mix(in hsl, var(--overlay-color), transparent 10%) 10px,
            color-mix(in hsl, var(--overlay-color), transparent 100%) calc(var(--overlay-height)),
            color-mix(in hsl, var(--overlay-color), transparent 100%) calc(100% - var(--overlay-height)),
            color-mix(in hsl, var(--overlay-color), transparent 10%) calc(100% - 10px)
        );
        // background: linear-gradient(to bottom,
        //     color-mix(in hsl, var(--overlay-color), transparent 100%) calc(var(--overlay-height)),
        //     color-mix(in hsl, var(--overlay-color), transparent 100%) calc(100% - var(--overlay-height)),
        //     color-mix(in hsl, var(--overlay-color), transparent 10%) calc(100% - 10px)
        // );
        inset: calc(var(--app-padding));
        z-index: 11;
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
    align-self: flex-end;
    justify-self: center;
    bottom: calc(var(--app-padding) + 12px);
}

.page {
    grid-column: 1 / -1;

    &--project {
        grid-column: 2 / -1;
        grid-row: 1;
        align-self: center;
    }
}

.projects {
    position: sticky;
    top: 0;
    height: min-content;
}
</style>
