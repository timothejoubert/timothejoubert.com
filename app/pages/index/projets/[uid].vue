<script lang="ts" setup>
import { joinURL } from 'ufo'
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'
import { ensureProtocol } from '~/utils/url'

const { t } = useI18n()
const { site } = useRuntimeConfig().public

const backPath = getRoutePath('index')

const { document } = await useFetchPage(prismicDocumentType.PROJECT_PAGE, { fatal: false })

if (document.value && !document.value.data.favorite) {
	await navigateTo(getRoutePath('projet-archive', { uid: document.value.uid }), { redirectCode: 301 })
}

const { title, description, canonicalUrl, noindex } = usePrismicMeta(document)
if (!noindex.value) {
	usePrismicProjectSchemaOrg(document, {
		title: title.value,
		description: description.value,
		canonicalUrl: canonicalUrl.value,
		breadcrumb: [{ name: t('home_page.heading'), item: joinURL(ensureProtocol(site.url), backPath) }],
	})
}
</script>

<template>
    <VProjectPage
        :document="document"
        :back-path="backPath"
    />
</template>
