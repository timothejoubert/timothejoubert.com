<script lang="ts" setup>
import { filter } from '@prismicio/client'
import type { ArchiveDocument, ProjectDocumentData } from '~~/prismicio-types'
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

defineProps<{
	document: ArchiveDocument
}>()

const route = useRoute()
const fetchOptions = computed(() => {
	const result = {
		orderings: [{ field: `my.project.date`, direction: 'desc' as const }],
		filters: [filter.at('my.project.favorite', false)],
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

const { data: projects, error, pending } = usePrismicFetchDocumentListing(prismicDocumentType.PROJECT_PAGE, fetchOptions)

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

const animationEnabled = ref(false)

function onRowClick(event: MouseEvent, uid: string) {
	if ((event.target as HTMLElement).closest('a')) {
		// Let the arrow link itself handle its own navigation/modifier clicks.
		return
	}
	navigateTo(getRoutePath('projet-archive', { uid }))
}
</script>

<template>
    <main :class="$style.root">
        <table :class="$style.table">
            <caption class="visually-hidden">
                {{ $t('archive_page.projects_list_caption') }}
            </caption>
            <thead>
                <tr :class="$style['head-row']">
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
                    <td
                        :class="$style['cell--right']"
                        class="visually-hidden"
                    >
                        {{ $t('project_link') }}
                    </td>
                </tr>
            </thead>
            <tbody
                :class="[
                    $style.body,
                    animationEnabled && $style['body--animation-enabled'],
                ]"
                @mouseenter="() => animationEnabled = true"
                @mouseleave="() => animationEnabled = false"
            >
                <tr
                    v-if="fallbackMessage"
                    :class="$style['body-row']"
                >
                    <td :colspan="6">
                        {{ fallbackMessage }}
                    </td>
                </tr>
                <template v-else-if="projects?.length">
                    <tr
                        v-for="project in projects"
                        :key="project.id"
                        :class="$style['body-row']"
                        @click="onRowClick($event, project.uid)"
                    >
                        <td>
                            <span>
                                {{ project.data.title }}
                            </span>
                        </td>
                        <td>
                            <VTime :date="project.data.date" />
                        </td>
                        <td>
                            <span>
                                {{ project.data.framework }}
                            </span>
                        </td>
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
                            <VPrismicLink
                                :to="getRoutePath('projet-archive', { uid: project.uid })"
                                :class="$style['arrow-link']"
                            >
                                <VIcon
                                    prefix="material-symbols"
                                    name="north-east"
                                />
                            </VPrismicLink>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </main>
</template>

<style lang="scss" module>

// Hover effect
// lorsque je survol l'une des lignes du tableau, son bandeau se déplace depuis la direction d'ou provient la souris pour recouvrir la ligne survolée
// lorsque je survol la ligne suivante, le bandeau se déplace vers le bas pour disparaître
// lorsque je survol la ligne precédante, le bandeau se déplace vers le haut pour disparaître
// lors d'un survol rapide vers le bas, ca donne un effet de balayage du haut vers le bas avec de multiples bandeaux qui se suivent

.root {
    --v-archive-row-border-radius: 8px;
    --v-archive-border-spacing: 5px;
    --v-start-rest-color: black;

    width: 100%;
}

.table {
    width: 100%;
    border-spacing: 0 0;

    td {
        padding-inline: 18px;
    }
}

.head-row td {
    padding-block: 4px;
}

.body-row {
    cursor: pointer;
}

.body-row td {
    position: relative;
    overflow: hidden;
    padding-block: 14px;

    > * {
        // set above the pseudo elements
        position: relative;
    }

    // Default background
    &::after {
        position: absolute;
        z-index: -1;
        background-color: var(--color-surface);
        content: '';
        inset: var(--v-archive-border-spacing) 0;
        pointer-events: none;
    }

    &:first-child::after {
        border-bottom-left-radius: var(--v-archive-row-border-radius);
        border-top-left-radius: var(--v-archive-row-border-radius);
    }

    &:last-child::after {
        border-bottom-right-radius: var(--v-archive-row-border-radius);
        border-top-right-radius: var(--v-archive-row-border-radius);
    }

    // Hovered background
    &::before {
        position: absolute;
        background-color: var(--color-background);
        content: '';
        inset: var(--v-archive-border-spacing) 0;
        opacity: 0.7;
        pointer-events: none;
        translate: 0 100%;
    }
}

@media (hover: hover) {
    // Hovering any cell counts as hovering the whole row.
    .body-row:hover td::before {
        translate: 0 0;
    }
}

.body {
    &:not(.body--animation-enabled) td::before {
        transition: none;
        translate: 0 calc(-100% - var(--v-archive-border-spacing));
    }

    &--animation-enabled td::before {
        transition: translate 0.3s ease(out-quad);
    }
}

.table:has(.body-row:hover) .body-row:hover ~ .body-row td::before {
    translate: 0 calc(-100% - var(--v-archive-border-spacing));
}

.tags {
    display: flex;
    align-items: center;
    gap: 8px;
}

.arrow-link {
    color: inherit;

    &::before {
        position: absolute;
        content: '';
        inset: 0;
    }
}

.cell--right {
    text-align: right;
}
</style>
