<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.ABOUT_PAGE)
usePrismicMeta(document, { schemaOrgType: 'AboutPage' })
</script>

<template>
    <VAboutPage
        v-if="document"
        :document="document"
    />
</template>
