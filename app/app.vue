<script lang="ts" setup>
import { getFilledLinkToWeb } from '~/utils/prismic/link-field'

// TODO: try SSR and client-side teleport for project page content

const runtimeConfig = useRuntimeConfig()
const { data: settings } = await usePrismicSettingsDocument()

useSchemaOrg([
	definePerson({
		name: runtimeConfig.public.site.name,
		email: settings.value?.data.email || undefined,
		sameAs: settings.value?.data.socials
			.map(({ link }) => getFilledLinkToWeb(link)?.url)
			.filter((url): url is string => !!url),
	}),
])
</script>

<template>
    <div :class="$style.root">
        <NuxtRouteAnnouncer />
        <NuxtLoadingIndicator color="#DBE6EC" />
        <a
            href="#main-content"
            :class="$style['skip-link']"
        >
            {{ $t('skip_to_content') }}
        </a>
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

.skip-link {
    position: fixed;
    z-index: 1002;
    top: 0;
    left: 0;
    padding: 12px 20px;
    background-color: var(--color-surface);
    color: var(--color-content);
    translate: 0 -100%;

    &:focus-visible {
        translate: 0 0;
    }
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
