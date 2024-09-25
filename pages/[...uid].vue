<script lang="ts" setup>
// import { defaultPageTransition } from '~/transitions/default-page-transition'
import { isExistingDocumentType } from '~/utils/prismic/document-type'
import { DocumentType } from '~/constants/document-type'

// definePageMeta({
//     pageTransition: defaultPageTransition,
// })

const prismicDocumentType = useMapRouteToPrismicDocument()
const { prismicDocumentData, alternateLinks, error } = await usePrismicFetchPage(prismicDocumentType)

if (!isExistingDocumentType(prismicDocumentType)) {
    showError({ status: 404, message: 'Le type de document prismic recherché n\'est pas inclu dans l\'application' })
}
else if (error) {
    showError(error)
}

console.log('prismicDocumentType', prismicDocumentType, prismicDocumentData.url)

usePage({
    webResponse: prismicDocumentData,
    alternateLinks,
})

const displayedPage = computed(() => {
    switch (prismicDocumentType) {
        case DocumentType.PROJECT_LISTING:
            return 'project-listing'
        case DocumentType.ARCHIVE:
            return 'archive'
        case DocumentType.ABOUT:
            return 'about'
        case DocumentType.PROJECT:
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
            :prismic-document="prismicDocumentData"
        />
        <LazyVAboutPage
            v-else-if=" displayedPage === 'archive'"
            :prismic-document="prismicDocumentData"
        />
        <LazyVAboutPage
            v-else-if=" displayedPage === 'about'"
            :prismic-document="prismicDocumentData"
        />
        <LazyVProjectPage
            v-else-if=" displayedPage === 'project'"
            :prismic-document="prismicDocumentData"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
