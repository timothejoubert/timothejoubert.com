<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-schema'
import { getSchemaOrgIdentityId } from '~/utils/schema-org'

const { site } = useRuntimeConfig().public

const { document } = await useFetchPage(prismicDocumentType.ABOUT_PAGE)
// A personal profile: `ProfilePage` + `mainEntity` is what Google expects for the `Person` it describes
usePrismicMeta(document, { schemaOrgType: ['AboutPage', 'ProfilePage'], mainEntityId: getSchemaOrgIdentityId(site.url) })
</script>

<template>
    <VAboutPage
        v-if="document"
        :document="document"
    />
</template>
