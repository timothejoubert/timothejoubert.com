<script lang="ts" setup>
import { withQuery } from 'ufo'
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

const route = useRoute()
const { document } = await useFetchPage(prismicDocumentType.PROJECT_PAGE)

if (document.value && document.value.data.favorite) {
	await navigateTo(getRoutePath('projet', { uid: document.value.uid }), { redirectCode: 301 })
}

usePrismicMeta(document)
</script>

<template>
    <VProjectPage
        v-if="document"
        :document="document"
        :back-path="withQuery(getRoutePath('archive'), route.query)"
    />
</template>
