<script lang="ts" setup>
import { isFilled } from '@prismicio/client'
import { getFilledLinkToWeb } from '~/utils/prismic/link-field'

const { data: settings } = await usePrismicSettingsDocument()
const publisher = computed(() => settings.value?.data)

useSchemaOrg([
	definePerson({
		name: publisher.value?.publisher_name || undefined,
		url: getFilledLinkToWeb(publisher.value?.publisher_url)?.url,
		image: isFilled.image(publisher.value?.publisher_image) ? publisher.value.publisher_image.url : undefined,
		email: publisher.value?.email || undefined,
		jobTitle: publisher.value?.publisher_job_title || undefined,
		worksFor: publisher.value?.publisher_work_for ? { '@type': 'Organization', name: publisher.value.publisher_work_for } : undefined,
		sameAs: publisher.value?.socials
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
    place-self: flex-end center;
    translate: 0 50%;

    &::before {
        position: absolute;
        display: block;
        content: '';
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
