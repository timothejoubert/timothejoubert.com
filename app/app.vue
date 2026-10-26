<script lang="ts" setup>
// Same hashed asset as the @font-face src in assets/scss/_fonts.scss, so the preload is reused instead of fetched twice.
import fraktionSansUrl from '~/assets/fonts/pp-fraktion-sans-variable.woff2?url'

useHead({
    link: [{ rel: 'preload', as: 'font', type: 'font/woff2', href: fraktionSansUrl, crossorigin: '' }],
})

await usePrismicPersonSchemaOrg()
</script>

<template>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator color="#DBE6EC" />

    <VSkipLink />

    <VNav />

    <NuxtPage />

    <DevOnly>
        <VGridVisualizer />
    </DevOnly>
</template>
