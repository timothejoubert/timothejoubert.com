<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-document'

const { document } = await useFetchPage(prismicDocumentType.ARCHIVE_PAGE)

usePrismicMeta(document)
</script>

<template>
    <VArchivePage
        v-if="document"
        :document="document"
    />
    <NuxtPage />
</template>
