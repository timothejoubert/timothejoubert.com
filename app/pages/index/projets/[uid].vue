<script lang="ts" setup>
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_PAGE)

if (document.value && !document.value.data.favorite) {
	await navigateTo(getRoutePath('projet-archive', { uid: document.value.uid }), { redirectCode: 301 })
}

const { title, description, canonicalUrl, noindex } = usePrismicMeta(document)
if (!noindex.value) {
	usePrismicProjectSchemaOrg(document, {
		title: title.value,
		description: description.value,
		canonicalUrl: canonicalUrl.value,
	})
}
</script>

<template>
    <VProjectPage
        v-if="document"
        :document="document"
        :back-path="getRoutePath('index')"
    />
</template>
