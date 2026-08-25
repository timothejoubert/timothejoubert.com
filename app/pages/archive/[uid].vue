<script lang="ts" setup>
import { joinURL, withQuery } from 'ufo'
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'
import { ensureProtocol } from '~/utils/url'

const { t } = useI18n()
const { site } = useRuntimeConfig().public

const route = useRoute()
const backPath = withQuery(getRoutePath('archive'), route.query)

const { document } = await useFetchPage(prismicDocumentType.PROJECT_PAGE, { fatal: false })

if (document.value && document.value.data.favorite) {
	await navigateTo(getRoutePath('projet', { uid: document.value.uid }), { redirectCode: 301 })
}

const { title, description, canonicalUrl, noindex } = usePrismicMeta(document)
if (!noindex.value) {
	usePrismicProjectSchemaOrg(document, {
		title: title.value,
		description: description.value,
		canonicalUrl: canonicalUrl.value,
		breadcrumb: [{ name: t('archive_page.heading'), item: joinURL(ensureProtocol(site.url), getRoutePath('archive')) }],
	})
}
</script>

<template>
    <VProjectPage
        :document="document"
        :back-path="backPath"
    />
</template>
