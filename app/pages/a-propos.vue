<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-document'

const { document } = await useFetchPage(prismicDocumentType.ABOUT_PAGE)
usePrismicMeta(document)
</script>

<template>
    <VAboutPage
        v-if="document"
        :document="document"
    />
</template>
