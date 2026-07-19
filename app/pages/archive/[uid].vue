<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-document'
import { getRoutePath } from '~~/shared/prismic-routes'

const { document } = await useFetchPage(prismicDocumentType.PROJECT_PAGE)

usePrismicMeta(document)
</script>

<template>
    <VProjectPage
        v-if="document"
        :document="document"
        :back-path="getRoutePath('archive')"
    />
</template>
