<script lang="ts" setup>
// TODO: try SSR and client-side teleport for project page content
</script>

<template>
    <div :class="$style.root">
        <NuxtRouteAnnouncer />
        <NuxtLoadingIndicator color="#DBE6EC" />
        <VHeader :class="$style.nav" />

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
    margin: var(--app-padding) var(--app-padding) 70px var(--app-padding);
}

.nav {
    position: fixed;
    z-index: 1001;
    bottom: calc(var(--app-padding));
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
