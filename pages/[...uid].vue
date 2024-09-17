<script lang="ts" setup>
import { computed } from 'vue'
import { defaultPageTransition } from '~/transitions/default-page-transition'
import { isExistingDocumentType } from '~/utils/prismic/document-type'
import { useRoutePathToPrismicDocument } from '~/composables/use-route-path-to-prismic-document'
import { usePrismicFetchPage } from '~/composables/use-prismic-fetch-page'
import { usePrismicFetchDocuments } from '~/composables/use-prismic-fetch-documents'
import VProjectCard from '~/components/molecules/VProjectCard.vue'

definePageMeta({
    pageTransition: defaultPageTransition,
})

const prismicDocumentType = useRoutePathToPrismicDocument()
const { prismicDocumentData, pageData, alternateLinks, error } = await usePrismicFetchPage(prismicDocumentType)
const { data: projectListingResponse } = usePrismicFetchDocuments('project')

const projects = computed(() => projectListingResponse.value.results)
console.log('prismicDocumentType', prismicDocumentType, projects.value)

if (!isExistingDocumentType(prismicDocumentType)) {
    showError({ status: 404, message: 'Le type de document prismic recherché n\'est pas inclu dans l\'application' })
}
else if (error) {
    showError(error)
}
const runtimeConfig = useRuntimeConfig()

const pageTitle = computed(() => `${pageData?.meta_title || pageData?.title} | ${runtimeConfig.public.siteName}`)

usePage({
    webResponse: prismicDocumentData,
    alternateLinks,
    title: pageTitle.value,
})
</script>

<template>
    <div :class="$style.root">
        <div>
            page Content
        </div>
        <pre>{{ pageData }}</pre>
        <ol v-if="projects.length">
            <li
                v-for="project in projects"
                :key="project.uid"
            >
                <VProjectCard

                    :project="project"
                />
            </li>
        </ol>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
