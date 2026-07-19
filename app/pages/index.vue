<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-document'

const { document } = await useFetchPage(prismicDocumentType.HOME_PAGE)

usePrismicMeta(document)
</script>

<template>
    <VHomePage :document="document" />
    <NuxtPage />
</template>
