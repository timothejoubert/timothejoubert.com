<script lang="ts" setup>
const { data: projects } = await usePrismicFetchProjects(true)

await useFetchPage(undefined)
const currentPage = useCurrentPage()
const pageType = computed(() => currentPage.value.document?.type)

const displayProjects = computed(() => {
	return pageType.value === 'home_page' || pageType.value === 'project_listing_page' || pageType.value === 'project'
})
</script>

<template>
    <div>
        <VThemeSwitcher />
        <DevOnly>
            <VGridVisualizer />
        </DevOnly>

        <NuxtRouteAnnouncer />
        <VNav :class="$style.nav" />
        <NuxtPage />
        <VProjectListing
            v-if="projects?.length && displayProjects"
            :projects="projects"
        />
    </div>
</template>

<style lang="scss" module>
.nav {
    position: fixed;
    z-index: 101;
    bottom: 24px;
    left: 50%;
    translate: -50%;
}
</style>
