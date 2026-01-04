<script lang="ts" setup>
import type { AboutDocument, ArchiveDocument, ProjectDocument, HomePageDocument } from '~~/prismicio-types'
import { prismicDocumentType } from '~~/shared/prismic-document'

const { document } = await useFetchPage(undefined)

const projectDocument = computed(() => document.value.type === prismicDocumentType.PROJECT_PAGE ? document.value as ProjectDocument : undefined)
const archiveDocument = computed(() => document.value.type === prismicDocumentType.ARCHIVE_PAGE ? document.value as ArchiveDocument : undefined)
const aboutDocument = computed(() => document.value.type === prismicDocumentType.ABOUT_PAGE ? document.value as AboutDocument : undefined)
const homeDocument = computed(() => document.value.type === prismicDocumentType.HOME_PAGE ? document.value as HomePageDocument : undefined)
// const projectListingDocument = computed(() => document.value.type === prismicDocumentType.PROJECT_LISTING_PAGE ? document.value as ProjectListingPageDocument : undefined)
</script>

<template>
    <LazyVHomePage
        v-if="homeDocument"
        :document="homeDocument"
    />
    <LazyVArchivePage
        v-else-if="archiveDocument"
        :document="archiveDocument"
    />
    <LazyVAboutPage
        v-else-if="aboutDocument"
        :document="aboutDocument"
    />
    <LazyVProjectPage
        v-else-if="projectDocument"
        :document="projectDocument"
    />
</template>
