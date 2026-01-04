<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-document'

await useFetchPage(undefined)
const currentPage = useCurrentPage()

const currentPageType = computed(() => currentPage.value.document?.type)

const displayProjects = computed(() => {
	return [
		prismicDocumentType.PROJECT_PAGE,
	].some(type => type === currentPageType.value)
})
</script>

<template>
    <div :class="$style.root">
        <NuxtRouteAnnouncer />
        <VHeader :class="$style.nav" />

        <LazyVMainProjectListing
            v-if="displayProjects"
            :class="$style.projects"
        />

        <NuxtPage />

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
    margin: calc(var(--app-padding));
}

.nav {
    position: fixed;
    z-index: 1001;
    bottom: calc(var(--app-padding) + 12px);
    place-self: flex-end center;
}

.page-container {
    display: flex;
    width: 100%;
}

.projects {
    grid-auto-rows: min-content;
}
</style>
