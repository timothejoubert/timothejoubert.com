<script lang="ts" setup>
import { filter } from '@prismicio/client'
import { joinURL, withQuery } from 'ufo'
import type { ArchiveDocument, ProjectDocumentData } from '~~/prismicio-types'
import { getRoutePath, prismicDocumentType } from '~~/shared/prismic-schema'
import { ensureProtocol } from '~/utils/url'

defineProps<{
	document: ArchiveDocument
}>()

const { phase } = usePageIntro()
const pageRevealed = computed(() => phase.value === 'page' || phase.value === 'done')

const route = useRoute()
const router = useRouter()

// A project modal (nested route) renders its own <h1> for the project title — the listing's
// own heading is demoted to <h2> in that case so the page only ever has one <h1>.
const headingTag = computed(() => route.params.uid ? 'h2' : 'h1')

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

// `title`'s ordering via Prismic's API is a byte/codepoint comparison, not locale-aware — French
// titles with accents (e.g. "Éclipse") sort completely wrong (verified against the live API:
// accented titles get shoved to the very end; sorting by `uid` instead doesn't work either — both
// `my.project.uid` and `document.uid` are silently ignored by the API). It falls back to a stable
// server-side ordering and is re-sorted client-side with `localeCompare` instead.
const fetchOptions = computed(() => {
	const isServerSortable = sortField.value !== 'title'
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

const documentListing = usePrismicFetchDocumentListing(prismicDocumentType.PROJECT_PAGE, fetchOptions)
// Awaited here (unlike a plain `if` right after the un-awaited call) so the initial `useSchemaOrg`
// call below runs synchronously once the data is actually resolved — `useSchemaOrg`/`inject()`
// only work inside setup()'s own synchronous flow (a top-level `await` in <script setup> keeps
// that flow intact; a `watchEffect` callback, which runs detached from it, does not). Later
// client-side re-fetches (sort changes) still update `pending`/`projects` reactively as before —
// only this one-shot schema.org emission is tied to the initial resolution.
await documentListing
const { data: projects, error, pending } = documentListing

const rows = computed(() => {
	if (pending.value) {
		return Array.from({ length: 20 }, (_, i) => ({ id: `skeleton-${i}`, index: i, uid: null, data: null }))
	}

	return projects.value || []
})

const { site } = useRuntimeConfig().public
if (projects.value?.length) {
	useSchemaOrg([
		defineItemList({
			itemListElement: projects.value.map((project, index) => ({
				position: index + 1,
				name: project.data.title,
				url: joinURL(ensureProtocol(site.url), getRoutePath('projet-archive', { uid: project.uid })),
			})),
		}),
	])
}

function getTagLabels(tagGroup: ProjectDocumentData['tag_group']) {
	return tagGroup
		.filter(item => item.tag)
		.map(item => item.tag) || []
}

const sortedRows = computed(() => {
	if (sortField.value !== 'title') return rows.value

	const direction = sortDirection.value === 'asc' ? 1 : -1

	return [...rows.value].sort((a, b) => direction * (a.data?.title ?? '').localeCompare(b.data?.title ?? ''))
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
	<VPageWrapper
		:class="$style.root"
	>
        <component
            :is="headingTag"
            class="visually-hidden"
        >
            {{ document.data.title }}
        </component>
            <table :class="$style.table">
                <caption class="visually-hidden">
                    {{ $t('archive_page.projects_list_caption') }}
                </caption>
                <thead>
                    <tr :class="[$style['head-row'], pageRevealed && $style['head-row--visible']]">
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
                        >
                            {{ $t('tags') }}
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
                        >
                            <span class="visually-hidden">{{ $t('project_link') }}</span>
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
                                pageRevealed && $style['body-row--visible'],
                                $style[`body-row--band-${rowBandState(index)}`],
                            ]"
                            @click="onRowClick($event, project.uid)"
                            @mouseenter="onRowEnter(index)"
                            @mouseleave="onRowLeave($event, index)"
							:style="{ '--loading-animation-delay': `${index * 0.02}s`, '--row-index': index }"
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
	</VPageWrapper>
</template>

<style lang="scss" module>
@use '@/assets/scss/mixins/loading-animation' as *;

@keyframes loading-animation {
    100% {
        background-position: -480% center;
    }
}

// Hover effect
// lorsque je survol l'une des lignes du tableau, son bandeau se déplace depuis la direction d'ou provient la souris pour recouvrir la ligne survolée
// lorsque je survol la ligne suivante, le bandeau se déplace vers le bas pour disparaître
// lorsque je survol la ligne precédante, le bandeau se déplace vers le haut pour disparaître
// lors d'un survol rapide vers le bas, ca donne un effet de balayage du haut vers le bas avec de multiples bandeaux qui se suivent

.root {
    --v-archive-row-border-radius: 8px;

    width: 100%;
}

.table {
    width: 100%;
	border-spacing: 0 10px;
    table-layout: fixed;
}

.cell {
	box-sizing: border-box;
    padding-inline: 18px;
	vertical-align: middle;
	white-space: nowrap;

	@include media('<600px') {
		// framework
		&:nth-child(3) {
            display: none;
        }
    }

	@include media('<800px') {
		// rate
		&:nth-child(5) {
            display: none;
        }
	}

	@include media('<1000px') {
		// tags
		&:nth-child(4) {
            display: none;
        }
	}
}

.head-row {
    opacity: 0;
    translate: 0 24px;

    @media (prefers-reduced-motion: no-preference) {
        transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
    }

    &--visible {
        opacity: 1;
        translate: 0 0;
    }
}

.head-cell {
	font-weight: inherit;
	text-align: inherit;

	&:nth-child(1) {
		width: 20ch;
	}

	&:nth-child(2) {
		width: 8ch;
	}

	// framework
	&:nth-child(3) {
		width: 8ch;
	}

	// tags
	&:nth-child(4) {
		width: 18ch;
	}

	// rate
	&:nth-child(5) {
		width: 90px;
	}

	// link
	&:nth-child(6) {
		width: 30px;
	}
}

.body {
	position: relative;
}

.body-row {
    cursor: pointer;
    opacity: 0;
    translate: 0 24px;

    @media (prefers-reduced-motion: no-preference) {
        transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
        transition-delay: calc(var(--row-index, 0) * 20ms);
    }

    &--visible {
        opacity: 1;
        translate: 0 0;
    }

	&--skeleton {
		$gradient-color: #ffffff0b;

		animation: loading-animation 1.4s var(--loading-animation-delay, 0s) infinite ease(in-out-circ);
		background-color: color-mix(in srgb, var(--color-content) 7%, var(--color-background));
		background-image: linear-gradient(
				to right,
				transparent 0%,
				$gradient-color 10%,
				$gradient-color 20%,
				transparent 30%
		);
		background-position: 120% center;
		background-repeat: no-repeat;
		background-size: 120% 100%;
		content: '';
	}
}

.body-cell {
    position: relative;
    overflow: hidden;
    padding-block: 8px;

    > * {
        // set above the pseudo elements
        position: relative;
		z-index: 1;
    }

    &:first-child {
        border-bottom-left-radius: var(--v-archive-row-border-radius);
        border-top-left-radius: var(--v-archive-row-border-radius);
    }

    &:last-child {
        border-bottom-right-radius: var(--v-archive-row-border-radius);
        border-top-right-radius: var(--v-archive-row-border-radius);
    }

    // Default background
    &::before,
    &::after {
        position: absolute;
		z-index: -1;
        background-color: color-mix(in srgb, var(--color-content) 7%, var(--color-background));
        content: '';
        inset: 0;
        pointer-events: none;
    }

	.body-row--skeleton &::before {
		display: none;
	}

    // Hovered background
    &::after {
        background-color: color-mix(in srgb, var(--color-content) 15%, var(--color-background));

        // background-color: var(--color-background);
        translate: 0 100%;

        // opacity: 0.7;

		.body--has-interacted & {
			transition: translate 0.3s ease(out-quad);
		}

		.body-row:has(a[aria-current='page']) & {
			translate: 0 0;
		}

		@media (hover: hover) {
			.body-row--band-visible & {
				translate: 0 0;
			}

			.body-row--band-above & {
				translate: 0 -100%;
			}
		}
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
