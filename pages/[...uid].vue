<script lang="ts" setup>
// import { defaultPageTransition } from '~/transitions/default-page-transition'
import { isExistingDocumentType } from '~/utils/prismic/document-type'

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
</script>

<template>
    <div :class="$style.root">
        <VPageFactory
            :type="prismicDocumentType"
            :document="prismicDocumentData"
        />
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
