<script lang="ts" setup>
import { PrismicDocumentType } from '~/constants/prismic-document-type'
// import {defaultPageTransition} from "~/transitions/default-page-transition";

// definePageMeta({
// pageTransition: defaultPageTransition,
// })

const prismicDocumentType = useMapRouteToPrismicDocument()
const { webResponse, error } = await usePrismicFetchPage(prismicDocumentType)

if (error) {
    showError(error)
}
else if (!webResponse) {
    showError({ status: 404, statusText: 'Undefined Prismic document' })
}

console.log('webResponse', webResponse)
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
</script>

<template>
    <div :class="$style.root">
        <LazyVProjectListingPage
            v-if=" displayedPage === 'project-listing'"
            :prismic-document="webResponse"
        />
        <LazyVArchivePage
            v-else-if=" displayedPage === 'archive'"
            :prismic-document="webResponse"
        />
        <LazyVAboutPage
            v-else-if=" displayedPage === 'about'"
            :prismic-document="webResponse"
        />
        <LazyVProjectPage
            v-else-if=" displayedPage === 'project'"
            :prismic-document="webResponse"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
