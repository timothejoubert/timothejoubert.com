<script lang="ts" setup>
// TODO: try SSR and client-side teleport for project page content
</script>

<template>
    <div :class="$style.root">
        <NuxtRouteAnnouncer />
        <NuxtLoadingIndicator color="#DBE6EC" />
        <VNav :class="$style.nav" />

        <NuxtPage />

        <DevOnly>
            <VGridVisualizer :class="$style.grid" />
        </DevOnly>
    </div>
</template>

<style lang="scss" module>
.root {
    --app-padding-top: 24px;
    --app-padding-left: 24px;
    --app-padding-right: 24px;
    --app-padding-bottom: 70px;

    // --app-max-height: calc(100svh - var(--app-padding-top) - var(--app-padding-bottom));
    --app-inner-max-height: calc(100svh - var(--app-padding-top) - var(--app-padding-bottom));

    position: relative;
    min-height: 100svh;
    padding: var(--app-padding-top) var(--app-padding-right) var(--app-padding-bottom) var(--app-padding-left);
}

.page-container {
    min-height: calc(100vh - var(--app-padding-top) - var(--app-padding-bottom));
}

.nav {
    position: fixed;
    z-index: 1001;
    bottom: calc(var(--app-padding-bottom) * 0.5);
    translate: 0 50%;
    place-self: flex-end center;

    &::before {
        position: absolute;
        content: '';
        display: block;
        inset: -40% -30%;
        // background: radial-gradient(var(--color-surface) 30%, transparent);
        pointer-events: none;
        // backdrop-filter: blur(5px);
    }
}

.page-container {
    display: flex;
    width: 100%;
}

.projects {
    grid-auto-rows: min-content;
}
</style>
