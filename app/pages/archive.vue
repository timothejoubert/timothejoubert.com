<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'

const { document } = await useFetchPage(prismicDocumentType.ARCHIVE_PAGE)
const route = useRoute()

// A project modal (nested route, `archive/[uid].vue`) renders this page's script alongside its own —
// only emit this page's own CollectionPage schema.org node when no project modal is open on top of it.
usePrismicMeta(document, { schemaOrgType: route.params.uid ? undefined : 'CollectionPage' })
</script>

<template>
    <VArchivePage
        v-if="document"
        :document="document"
    />
    <NuxtPage />
</template>
