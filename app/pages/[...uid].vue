<script lang="ts" setup>
import type { AboutDocument, ArchiveDocument, HomePageDocument, ProjectDocument } from '~~/prismicio-types'
import { prismicDocumentType } from '~~/shared/prismic-document'

const { document } = await useFetchPage(undefined)

const projectDocument = computed(() => document.value.type === prismicDocumentType.PROJECT_PAGE ? document.value as ProjectDocument : undefined)
const archiveDocument = computed(() => document.value.type === prismicDocumentType.ARCHIVE_PAGE ? document.value as ArchiveDocument : undefined)
const aboutDocument = computed(() => document.value.type === prismicDocumentType.ABOUT_PAGE ? document.value as AboutDocument : undefined)
const homeDocument = computed(() => document.value.type === prismicDocumentType.HOME_PAGE ? document.value as HomePageDocument : undefined)
</script>

<template>
    <VProjectPage
        v-if="projectDocument"
        :document="projectDocument"
    />
    <VArchivePage
        v-else-if="archiveDocument"
        :document="archiveDocument"
    />
    <VAboutPage
        v-else-if="aboutDocument"
        :document="aboutDocument"
    />
    <div v-else-if="homeDocument">
        <h1>Home page</h1>
    </div>
    <div v-else>
        <h1>Fallback page</h1>
    </div>
</template>
