<script lang="ts" setup>
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_PAGE)

if (document.value && !document.value.data.favorite) {
	await navigateTo(getRoutePath('projet-archive', { uid: document.value.uid }), { redirectCode: 301 })
}

usePrismicMeta(document)
</script>

<template>
    <VProjectPage
        v-if="document"
        :document="document"
        :back-path="getRoutePath('index')"
    />
</template>
