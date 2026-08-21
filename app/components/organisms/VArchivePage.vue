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

// `tag` and `title` can't be sorted correctly by Prismic's API: `tag_group` is a repeatable Group
// field (orderings only support scalar document fields), and `title`'s ordering is a byte/codepoint
// comparison, not locale-aware — French titles with accents (e.g. "Éclipse") sort completely wrong
// (verified against the live API: accented titles get shoved to the very end). Both fall back to a
// stable server-side ordering and are re-sorted client-side with `localeCompare` instead.
const SERVER_SORTABLE_FIELDS = ['date', 'rate', 'framework']

const fetchOptions = computed(() => {
	const isServerSortable = SERVER_SORTABLE_FIELDS.includes(sortField.value)
	return {
		orderings: [{
			field: `my.project.${isServerSortable ? sortField.value : 'date'}`,
			direction: isServerSortable ? sortDirection.value : 'desc',
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

const {
	data: projects,
	error,
	pending
} = usePrismicFetchDocumentListing(prismicDocumentType.PROJECT_PAGE, fetchOptions)

const rows = computed(() => {
	if (pending.value) {
		return Array.from({ length: 20 }, (_, i) => ({ id: `skeleton-${i}`, index: i, uid: null, data: null }))
	}

	return projects.value || []
})

function getTagLabels(tagGroup: ProjectDocumentData['tag_group']) {
	return tagGroup
		.filter(item => item.tag)
		.map(item => item.tag) || []
}

function tagSortKey(tagGroup: ProjectDocumentData['tag_group'] | undefined) {
	const labels = tagGroup ? getTagLabels(tagGroup) : []
	return [...labels].sort((a, b) => (a ?? '').localeCompare(b ?? ''))[0] ?? ''
}

const sortedRows = computed(() => {
	if (!['tag', 'title'].includes(sortField.value)) return rows.value

	const direction = sortDirection.value === 'asc' ? 1 : -1

	if (sortField.value === 'title') {
		return [...rows.value].sort((a, b) => direction * (a.data?.title ?? '').localeCompare(b.data?.title ?? ''))
	}

	return [...rows.value].sort((a, b) => direction * tagSortKey(a.data?.tag_group).localeCompare(tagSortKey(b.data?.tag_group)))
})

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



function ariaSortFor(field: string) {
	if (sort.value.field !== field) return 'none'
	return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

const hoveredIndex = ref<number | null>(null)
// Frozen at the last real hover — never reset to `null` on leave — so rows
// still waiting "above" don't reclassify to "below" (and sweep through the
// visible position) just because the pointer left the table entirely.
const lastHoveredIndex = ref<number | null>(null)
// One-way latch: flips once on the first hover and never resets, so the
// band transition is off only for the very first paint (nothing to animate
// from yet) and on for the rest of the component's lifetime.
const hasInteracted = ref(false)

function onRowEnter(index: number) {
	hasInteracted.value = true
	hoveredIndex.value = index
	lastHoveredIndex.value = index
}

// When the pointer leaves a row without entering another one (i.e. it leaves
// the table entirely), `lastHoveredIndex` alone can't tell which way the band
// should exit — both "above" and "below" fall on the same row. Read the exit
// side from the cursor's position relative to the row instead.
function onRowLeave(event: MouseEvent, index: number) {
	hoveredIndex.value = null

	const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
	const exitedAbove = event.clientY < rect.top + rect.height / 2
	lastHoveredIndex.value = exitedAbove ? index - 1 : index
}

function rowBandState(index: number) {
	if (hoveredIndex.value === index) return 'visible'
	if (lastHoveredIndex.value === null || index <= lastHoveredIndex.value) return 'below'
	return 'above'
}

// Keeps the current sort query in the URL when opening a project — losing it would reset
// VArchivePage's sort to its default and trigger an unwanted refetch/skeleton flash.
function projectPath(uid: string | null) {
	if (!uid) return
	return withQuery(getRoutePath('projet-archive', { uid }), route.query)
}

function onRowClick(event: MouseEvent, uid: string | null) {
	if (!uid || (event.target as HTMLElement).closest('a')) {
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
        <div :class="$style['scroll-wrapper']">
            <table :class="$style.table">
                <caption class="visually-hidden">
                    {{ $t('archive_page.projects_list_caption') }}
                </caption>
                <thead>
                    <tr :class="$style['head-row']">
                        <th
                            scope="col"
                            :class="[$style.cell, $style['head-cell']]"
                            :aria-sort="ariaSortFor('title')"
                        >
                            <VSortLink
                                v-model="sort"
                                :label="$t('name')"
                                field="title"
                            />
                        </th>
                        <th
                            scope="col"
                            :class="[$style.cell, $style['head-cell']]"
                            :aria-sort="ariaSortFor('date')"
                        >
                            <VSortLink
                                v-model="sort"
                                :label="$t('date')"
                                field="date"
                            />
                        </th>
                        <th
                            scope="col"
                            :class="[$style.cell, $style['head-cell']]"
                            :aria-sort="ariaSortFor('framework')"
                        >
                            <VSortLink
                                v-model="sort"
                                :label="$t('framework')"
                                field="framework"
                            />
                        </th>
                        <th
                            scope="col"
                            :class="[$style.cell, $style['head-cell']]"
                            :aria-sort="ariaSortFor('tag')"
                        >
                            <VSortLink
                                v-model="sort"
                                :label="$t('tags')"
                                field="tag"
                            />
                        </th>
                        <th
                            scope="col"
                            :class="[$style.cell, $style['head-cell']]"
                            :aria-sort="ariaSortFor('rate')"
                        >
                            <VSortLink
                                v-model="sort"
                                :label="$t('rate')"
                                field="rate"
                            />
                        </th>
                        <th
                            scope="col"
                            :class="[$style.cell, $style['head-cell'], $style['cell--right']]"
                            class="visually-hidden"
                        >
                            {{ $t('project_link') }}
                        </th>
                    </tr>
                </thead>
                <tbody
                    :class="[
                        $style.body,
                        hasInteracted && $style['body--has-interacted'],
                    ]"
                >
                    <tr
                        v-if="fallbackMessage"
                        :class="$style['body-row']"
                    >
                        <td
                            :colspan="6"
                            :class="[$style.cell, $style['body-cell']]"
                            aria-live="polite"
                        >
                            {{ fallbackMessage }}
                        </td>
                    </tr>
                    <template v-else-if="sortedRows?.length">
                        <tr
                            v-for="(project, index) in sortedRows"
                            :key="project.id"
                            :class="[
                                $style['body-row'],
                                pending && $style['body-row--skeleton'],
                                $style[`body-row--band-${rowBandState(index)}`],
                            ]"
                            @click="onRowClick($event, project.uid)"
                            @mouseenter="onRowEnter(index)"
                            @mouseleave="onRowLeave($event, index)"
							:style="{ '--loading-animation-delay': `${index * 0.02}s` }"
                        >
                            <td :class="[$style.cell, $style['cell--title'], $style['body-cell']]">
								{{ project.data?.title }}
                            </td>
                            <td :class="[$style.cell, $style['body-cell']]">
                                <VTime :date="project.data?.date" />
                            </td>
                            <td :class="[$style.cell, $style['body-cell']]">
								{{ project.data?.framework }}
                            </td>
                            <td :class="[$style.cell, $style['body-cell']]">
								<template v-if="project.data?.tag_group?.length">
									<VTag
										v-for="tag in getTagLabels(project.data.tag_group)"
										:key="tag + '-' + project.id"
										:label="tag"
										:class="$style.tag"
									/>
								</template>
                            </td>
                            <td :class="[$style.cell, $style['body-cell']]">
                                <VStarRate
									v-if="project.data?.rate"
									:rate="project.data.rate"
								/>
                            </td>
                            <td :class="[$style.cell, $style['body-cell'], $style['cell--right']]">
                                <VPrismicLink
                                    :to="projectPath(project.uid)"
                                    :class="$style['arrow-link']"
                                    :aria-label="`${$t('project_link')} : ${project.data?.title}`"
                                >
                                    <VIcon name="material-symbols:north-east" />
                                </VPrismicLink>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </main>
</template>

<style lang="scss" module>
@use '@/assets/scss/mixins/loading-animation' as *;

// Hover effect
// lorsque je survol l'une des lignes du tableau, son bandeau se déplace depuis la direction d'ou provient la souris pour recouvrir la ligne survolée
// lorsque je survol la ligne suivante, le bandeau se déplace vers le bas pour disparaître
// lorsque je survol la ligne precédante, le bandeau se déplace vers le haut pour disparaître
// lors d'un survol rapide vers le bas, ca donne un effet de balayage du haut vers le bas avec de multiples bandeaux qui se suivent

$v-archive-band-duration: 0.3s;

.root {
    --v-archive-row-border-radius: 8px;
    --v-archive-border-spacing: 5px;
    --v-start-rest-color: black;

    width: 100%;
}

.scroll-wrapper {
    overflow-x: auto;
}

.table {
    border-spacing: 0 0;
    table-layout: fixed;

    @include media('>=md') {
        width: 100%;
    }
}

.cell {
    padding-inline: 18px;
	vertical-align: middle;
}

.head-cell {
    font-weight: inherit;
    padding-block: 4px;
    text-align: inherit;

    &:nth-child(1) {
        // width: clamp(300px, 26%, 30ch);
		width: 26%;
	}

    &:nth-child(2) {
        // width: clamp(70px, 10%, 30ch);
		width: 10%;
    }

    &:nth-child(3) {
		// width: clamp(100px, 14%, 30ch);
		width: 14%;
    }

    &:nth-child(4) {
		// width: clamp(160px, 26%, 30ch);
		width: 26%;
    }

    &:nth-child(5) {
		// width: clamp(100px, 16%, 30ch);
		width: 16%;
    }

    &:nth-child(6) {
		// width: clamp(40px, 8%, 10ch);
		width: 8%;
    }
}

.body {
	position: relative;
}

.body-row {
    cursor: pointer;

	&--skeleton {
		$gradient-color: #ffffff0b;

		animation: loading-animation 1.4s var(--loading-animation-delay, 0s) infinite ease(in-out-circ);
		background-image: linear-gradient(
				to right,
				transparent 0%,
				$gradient-color 10%,
				$gradient-color 20%,
				transparent 30%
		);
		background-position: 120% center;
		background-repeat: no-repeat;
		background-size: 120% 80%;
		content: '';
	}
}

@keyframes loading-animation {
    100% {
        background-position: -480% center;
    }
}

.body-cell {
    position: relative;
    overflow: hidden;
    padding-block: 12px;

    > * {
        // set above the pseudo elements
        position: relative;
		z-index: 1;
    }

    // Default background
    &::before {
        position: absolute;
        z-index: -2;
        background-color: var(--color-surface);
        content: '';
        inset: var(--v-archive-border-spacing) 0;
        pointer-events: none;
    }

    &:first-child::before {
        border-bottom-left-radius: var(--v-archive-row-border-radius);
        border-top-left-radius: var(--v-archive-row-border-radius);
    }

    &:last-child::before {
        border-bottom-right-radius: var(--v-archive-row-border-radius);
        border-top-right-radius: var(--v-archive-row-border-radius);
    }

    // Hovered background
    &::after {
        position: absolute;
		z-index: -1;
        background-color: var(--color-background);
        content: '';
        inset: var(--v-archive-border-spacing) 0;
        opacity: 0.7;
        pointer-events: none;
        transition: none;
        translate: 0 100%;

		.body--has-interacted & {
			transition: translate $v-archive-band-duration ease(out-quad);
		}

		.body-row:has(a[aria-current='page']) & {
			translate: 0 0;
		}

		@media (hover: hover) {
			.body-row--band-visible & {
				translate: 0 0;
			}

			.body-row--band-above & {
				translate: 0 calc(-100% - var(--v-archive-border-spacing));
			}
		}

		// .body-row--band-below (and the pre-interaction default) both
		// resolve to the base `translate: 0 100%` above.
    }
}

.tag {
    white-space: nowrap;

    & + & {
        margin-left: 8px;
    }
}

.cell--title {
	white-space: nowrap;
}

.arrow-link {
    color: inherit;
}

.cell--right {
    text-align: right;
}
</style>
