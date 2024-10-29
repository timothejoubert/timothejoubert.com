<script lang="ts" setup>
import { PrismicDocumentType } from '~/constants/prismic-document-type'
import type { AboutDocument, ArchiveDocument, ProjectDocument, ProjectListingPageDocument } from '~/prismicio-types'
import { resolvePrismicDocumentFromPath } from '~/utils/prismic/route-resolver'

// import {defaultPageTransition} from "~/transitions/default-page-transition";
// definePageMeta({
// pageTransition: defaultPageTransition,
// })

const route = useRoute()
const prismicDocumentType = resolvePrismicDocumentFromPath(route.path)

if (!prismicDocumentType) {
    throw createError({
        statusCode: 404,
        statusMessage: `can't resolvePrismicDocumentFromPath on ${route.path}`,
    })
}

const { webResponse, error } = await usePrismicFetchPage(prismicDocumentType)

if (error) {
    showError(error)
}
else if (!webResponse) {
    showError({ status: 404, statusText: 'can\'t find prismic document' })
}

usePrismicSeoMeta(webResponse)

usePage({
    webResponse,
    alternateLinks: webResponse?.alternate_languages,
})

const displayedPage = computed(() => {
    switch (prismicDocumentType) {
        case PrismicDocumentType.PROJECT_LISTING:
            return 'project-listing'
        case PrismicDocumentType.ARCHIVE:
            return 'archive'
        case PrismicDocumentType.ABOUT:
            return 'about'
        case PrismicDocumentType.PROJECT:
            return 'project'
        default:
            return null
    }
})

if (!displayedPage.value) {
    showError({
        status: 404,
        message: `Le composant associé a ce type (${prismicDocumentType}) de page n'existe pas.`,
    })
}

const projectListingDocument = computed(() => displayedPage.value === 'project-listing' && webResponse as ProjectListingPageDocument)
const archiveDocument = computed(() => displayedPage.value === 'archive' && webResponse as ArchiveDocument)
const aboutDocument = computed(() => displayedPage.value === 'about' && webResponse as AboutDocument)
const projectDocument = computed(() => displayedPage.value === 'project' && webResponse as ProjectDocument)
</script>

<template>
    <LazyVProjectListingPage
        v-if="projectListingDocument"
        :document="projectListingDocument"
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
