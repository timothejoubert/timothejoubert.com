<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

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
