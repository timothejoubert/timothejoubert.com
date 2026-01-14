<script lang="ts" setup>
import type { ArchiveDocument, ProjectDocumentData } from '~~/prismicio-types'
import { prismicDocumentType } from '~~/shared/prismic-document'

defineProps<{
	document: ArchiveDocument
}>()

const { $prismic } = useNuxtApp()
const prismicFilter = $prismic.filter

const route = useRoute()
const fetchOptions = computed(() => {
	const result = {
		orderings: [{ field: `my.project.date`, direction: 'desc' as const }],
		filters: [prismicFilter.at('my.project.favorite', false)],
		graphQuery: `{
            project {
                title
                date
                rate
                tag_group
                framework
            }
        }`,
	}

	const value = route.query['ordering']
	const field = route.query['field']
	if (value && field) {
		Object.assign(result, {
			orderings: [{ field: `my.project.${field}`, direction: value }],
		})
	}

	return result
})

const { data: projects, error, pending } = usePrismicFetchDocuments(prismicDocumentType.PROJECT_PAGE, fetchOptions.value)

function getTagLabels(tagGroup: ProjectDocumentData['tag_group']) {
	return tagGroup
		.filter(item => item.tag)
		.map(item => item.tag) || []
}

const { t } = useI18n()
const fallbackMessage = computed(() => {
	if (error.value) {
		return t('archive_page.error_loading_projects')
	}
	if (pending.value) {
		return t('archive_page.loading_projects')
	}
	if (!projects.value?.length) {
		return t('archive_page.no_projects')
	}
	return null
})
</script>

<template>
    <main :class="$style.root">
        <table :class="$style.table">
            <caption class="visually-hidden">
                {{ $t('archive_page.projects_list_caption') }}
            </caption>
            <thead>
                <tr :class="[$style.row, $style['row--head']]">
                    <td>
                        <VSortLink
                            :label="$t('name')"
                            field="title"
                        />
                    </td>
                    <td>
                        <VSortLink
                            :label="$t('date')"
                            field="date"
                        />
                    </td>
                    <td>{{ $t('framework') }}</td>
                    <td>{{ $t('tags') }}</td>
                    <td>
                        <VSortLink
                            :label="$t('rate')"
                            field="rate"
                        />
                    </td>
                    <td :class="$style['cell--right']" />
                </tr>
            </thead>
            <tbody>
                <tr
                    v-if="fallbackMessage"
                    :class="[$style.row, $style['row--fallback']]"
                >
                    <td :colspan="6">
                        {{ fallbackMessage }}
                    </td>
                </tr>
                <template v-else-if="projects?.length">
                    <tr
                        v-for="project in projects"
                        :key="project.id"
                        :class="[$style.row, $style['row--body']]"
                    >
                        <td>{{ project.data.title }}</td>
                        <td>
                            <VTime :date="project.data.date" />
                        </td>
                        <td>{{ project.data.framework }}</td>
                        <td :class="$style.tags">
                            <VTag
                                v-for="tag in getTagLabels(project.data.tag_group)"
                                :key="tag + '-' + project.id"
                                :label="tag"
                            />
                        </td>
                        <td>
                            <VStarRate :rate="project.data.rate" />
                        </td>
                        <td :class="$style['cell--right']">
                            <VPrismicLink :to="project">
                                <VIcon name="arrow-up-right" />
                            </VPrismicLink>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </main>
</template>

<style lang="scss" module>
.root {
    --v-start-rest-color: black;

    width: 100%;
}

.table {
    width: 100%;
    border-spacing: 0 5px;
}

.tags {
    display: flex;
    align-items: center;
    gap: 8px;
}

.row td {
    padding-inline: 18px;
}

.row--head td {
    padding-block: 6px;
}

.row--fallback,
.row--body {
    background-color: var(--color-surface);

    td {
        padding-block: 10px;

        &:first-child {
            border-bottom-left-radius: 8px;
            border-top-left-radius: 8px;
        }

        &:last-child {
            border-bottom-right-radius: 8px;
            border-top-right-radius: 8px;
        }
    }
}

.row--body a {
    color: inherit
}

.cell--right {
    text-align: right;
}
</style>
