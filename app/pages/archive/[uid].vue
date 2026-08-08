<script lang="ts" setup>
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

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
