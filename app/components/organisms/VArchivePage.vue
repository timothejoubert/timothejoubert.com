<script lang="ts" setup>
import { filter } from '@prismicio/client'
import { withQuery } from 'ufo'
import type { ArchiveDocument, ProjectDocumentData } from '~~/prismicio-types'
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'

defineProps<{
	document: ArchiveDocument
}>()

const route = useRoute()
const router = useRouter()

// Kept as separate primitive computeds (not one object-returning computed) so Vue's
// value-equality short-circuit works: fetchOptions/the listing fetch below only reacts
// when field/direction actually change, not on every route change (e.g. opening a
// project modal appends a uid segment to the URL, which would otherwise still produce a
// new — but deep-equal — sort object and needlessly retrigger the fetch).
const sortField = computed(() => (route.query['field'] as string) || 'date')
const sortDirection = computed<'asc' | 'desc'>(() => route.query['ordering'] === 'asc' ? 'asc' : 'desc')

const sort = computed({
	get() {
		return { field: sortField.value, direction: sortDirection.value }
	},
	set(value) {
		router.replace({ query: { field: value.field, ordering: value.direction } })
	},
})

const fetchOptions = computed(() => {
	return {
		orderings: [{
			field: `my.project.${sortField.value}`,
			direction: sortDirection.value,
		}],
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
	if (!pending.value && !projects.value?.length) {
		return t('archive_page.no_projects')
	}
	return null
})

const SKELETON_ROW_COUNT = 20
const skeletonRows = computed(() => Array.from({ length: SKELETON_ROW_COUNT }, (_, i) => i))

function ariaSortFor(field: string) {
	if (sort.value.field !== field) return 'none'
	return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

const animationEnabled = ref(false)

// Keeps the current sort query in the URL when opening a project — losing it would reset
// VArchivePage's sort to its default and trigger an unwanted refetch/skeleton flash.
function projectPath(uid: string) {
	return withQuery(getRoutePath('projet-archive', { uid }), route.query)
}

function onRowClick(event: MouseEvent, uid: string) {
	if ((event.target as HTMLElement).closest('a')) {
		// Let the arrow link itself handle its own navigation/modifier clicks.
		return
	}
	navigateTo(projectPath(uid))
}
</script>

<template>
    <main
        id="main-content"
        :class="$style.root"
    >
        <h1 class="visually-hidden">
            {{ document.data.title }}
        </h1>
        <table :class="$style.table">
            <caption class="visually-hidden">
                {{ $t('archive_page.projects_list_caption') }}
            </caption>
            <thead>
                <tr :class="$style['head-row']">
                    <th scope="col" :aria-sort="ariaSortFor('title')">
                        <VSortLink
                            v-model="sort"
                            :label="$t('name')"
                            field="title"
                        />
                    </th>
                    <th scope="col" :aria-sort="ariaSortFor('date')">
                        <VSortLink
                            v-model="sort"
                            :label="$t('date')"
                            field="date"
                        />
                    </th>
                    <th scope="col">{{ $t('framework') }}</th>
                    <th scope="col">{{ $t('tags') }}</th>
                    <th scope="col" :aria-sort="ariaSortFor('rate')">
                        <VSortLink
                            v-model="sort"
                            :label="$t('rate')"
                            field="rate"
                        />
                    </th>
                    <th
                        scope="col"
                        :class="$style['cell--right']"
                        class="visually-hidden"
                    >
                        {{ $t('project_link') }}
                    </th>
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
                <template v-if="pending">
                    <tr :class="$style['body-row']">
                        <td
                            :colspan="6"
                            class="visually-hidden"
                            aria-live="polite"
                        >
                            {{ $t('archive_page.loading_projects') }}
                        </td>
                    </tr>
                    <tr
                        v-for="i in skeletonRows"
                        :key="`skeleton-row-${i}`"
                        :class="$style['body-row']"
                        aria-hidden="true"
                    >
                        <td><span :class="$style.skeleton" :style="{ width: `${120 - (i % 3) * 30}px` }" /></td>
                        <td><span :class="$style.skeleton" :style="{ width: `${45 - (i % 2) * 10}px` }" /></td>
                        <td><span :class="$style.skeleton" :style="{ width: `${85 - (i % 4) * 15}px` }" /></td>
                        <td :class="$style.tags">
                            <span :class="$style.skeleton" :style="{ width: `${60 - (i % 3) * 15}px` }" />
                            <span v-if="i % 2 === 0" :class="$style.skeleton" style="width: 55px" />
                        </td>
                        <td><span :class="$style.skeleton" style="width: 70px" /></td>
                        <td :class="$style['cell--right']">
                            <span :class="[$style.skeleton, $style['skeleton--icon']]" />
                        </td>
                    </tr>
                </template>
                <tr
                    v-else-if="fallbackMessage"
                    :class="$style['body-row']"
                >
                    <td
                        :colspan="6"
                        aria-live="polite"
                    >
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
                                :to="projectPath(project.uid)"
                                :class="$style['arrow-link']"
                                :aria-label="`${$t('project_link')} : ${project.data.title}`"
                            >
                                <VIcon
                                    name="material-symbols:north-east"
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
    table-layout: fixed;

    td,
    th {
        padding-inline: 18px;
    }
}

// Column widths are set on the header row (table-layout: fixed only reads the
// first row) so the skeleton and real rows always share the exact same column
// widths — otherwise switching between them (different content) shifts the
// columns and produces a visible flash.
.head-row th {
    font-weight: inherit;
    padding-block: 4px;
    text-align: inherit;

    &:nth-child(1) {
        width: 26%;
    }

    &:nth-child(2) {
        width: 10%;
    }

    &:nth-child(3) {
        width: 14%;
    }

    &:nth-child(4) {
        width: 26%;
    }

    &:nth-child(5) {
        width: 16%;
    }

    &:nth-child(6) {
        width: 8%;
    }
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

    @media (prefers-reduced-motion: no-preference) {
        &--animation-enabled td::before {
            transition: translate 0.3s ease(out-quad);
        }
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

.skeleton {
    display: inline-block;
    height: 1em;
    border-radius: 4px;
    background-color: var(--color-surface);

    &--icon {
        width: 1em;
        margin-left: auto;
    }

    @media (prefers-reduced-motion: no-preference) {
        animation: skeleton-pulse 1.2s ease-in-out infinite;
    }
}

@keyframes skeleton-pulse {
    0%, 100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}
</style>
