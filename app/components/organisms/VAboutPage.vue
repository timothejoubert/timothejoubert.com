<script lang="ts" setup>
import type { AboutDocument } from '~~/prismicio-types'
import { getFilledLinkToWeb } from '~/utils/prismic/link-field'

const props = defineProps<{
	document: AboutDocument
}>()

const { t } = useI18n()

const { phase } = usePageIntro()
const pageRevealed = computed(() => phase.value === 'page' || phase.value === 'done')

const page = computed(() => props.document.data)
const columns = computed(() => [
	{ key: 'formations', label: t('about_page.formations'), entries: page.value.formations ?? [] },
	{ key: 'experiences', label: t('about_page.experiences'), entries: page.value.experiences ?? [] },
])
</script>

<template>
	<VPageWrapper
		class="grid"
        :class="$style.root"
	>
        <LazyVHighlightedText
            v-if="page.content"
            :field="page.content"
            wrapper="p"
            :class="[$style.content, pageRevealed && $style['content--visible']]"
        />
        <div
			v-if="columns.some((column) => column.entries.length)"
			:class="[$style.columns, pageRevealed && $style['columns--visible']]"
		>
            <template
                v-for="column in columns"
                :key="column.key"
            >
                <section
                    v-if="column.entries.length"
                    :class="$style.column"
                >
                    <h2 :class="[$style['column-title'], pageRevealed && $style['column-title--visible']]">
                        {{ column.label }}
                    </h2>
                    <div
                        v-for="(entry, i) in column.entries"
                        :key="i"
                        :class="[$style.entry, pageRevealed && $style['entry--visible']]"
                        :style="{ '--entry-index': i }"
                    >
                        <div :class="$style.head">
                            <h3 :class="$style.title">
                                <VPrismicLink
                                    v-if="getFilledLinkToWeb(entry.link)"
                                    :to="getFilledLinkToWeb(entry.link)"
                                    :class="$style.link"
                                >
                                    {{ entry.title }}
                                    <VIcon
										:class="$style.icon"
										name="material-symbols:north-east"
									/>
                                </VPrismicLink>
                                <template v-else>
                                    {{ entry.title }}
                                </template>
                            </h3>
                            <VTime
                                v-if="entry.date"
                                :date="entry.date"
                                :class="$style.date"
                            />
                        </div>
						<VText
							v-if="entry.content"
							tag="p"
							:content="entry.content"
							:class="$style.column__content"
						/>
						<VText
							v-if="entry.place"
							tag="p"
							:content="entry.place"
							:class="$style.place"
						/>
                    </div>
                </section>
            </template>
        </div>
	</VPageWrapper>
</template>

<style lang="scss" module>
.root {
	--grid-container-width: 100%;

	padding-top: 15vh;
    row-gap: 82px;
}

.content {
    max-width: 60ch;
	font-family: #{$fraktion-mono-family};
	font-size: 24px;
	font-weight: 100;
	grid-column: 1 / -1;
    line-height: 1.7;
    margin-block: 0;
	margin-inline: auto;
	opacity: 0;
	text-align: center;
	translate: 0 24px;

	@media (prefers-reduced-motion: no-preference) {
		transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
	}

	&--visible {
		opacity: 1;
		translate: 0 0;
	}
}

.columns {
	position: relative;
	display: grid;
	grid-column: 1 / -1;
	grid-template-columns: subgrid;
	row-gap: 60px;

	@include media('>=lg') {
		&::before {
			position: absolute;
			top: 0;
			bottom: 0;
			left: calc(var(--gutter) * -0.5);
			width: 1PX;
			background-color: currentcolor;
			content: '';
			grid-column: 7;
			opacity: 0;

			@media (prefers-reduced-motion: no-preference) {
				transition: opacity 0.4s ease(out-quad);
			}
		}

		&--visible::before {
			opacity: 0.2;
		}
	}
}

.column {
	grid-column: 1 / -1;

	@include media('>=md') {
		&:nth-child(1) {
			grid-column: 1 / span 5;
		}

		&:nth-child(2) {
			grid-column: 8 / span 5;
		}
	}

	@include media('>=lg') {
		padding-inline: 24px;

		&:nth-child(1) {
			grid-column: 3 / span 4;
		}

		&:nth-child(2) {
			grid-column: 7 / span 4;
		}
	}
}

.column-title {
	font-size: 14px;
	font-weight: 500;
	margin-block: 0 28px;
	opacity: 0;
	text-transform: uppercase;
	translate: 0 24px;

	@media (prefers-reduced-motion: no-preference) {
		transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
	}

	&--visible {
		opacity: 0.5;
		translate: 0 0;
	}
}

.entry {
	opacity: 0;
	translate: 0 24px;

	& + & {
		margin-top: 32px;
	}

	@media (prefers-reduced-motion: no-preference) {
		transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
		transition-delay: calc(var(--entry-index, 0) * 50ms);
	}

	&--visible {
		opacity: 1;
		translate: 0 0;
	}
}

.head {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 20px;
}

.title {
	font-size: 16px;
	margin-block: 0;
}

.link {
	display: inline-flex;
	align-items: center;
	color: inherit;
	gap: 0.4em;
}

.icon {
	font-size: 16px;
}

.date {
	flex-shrink: 0;
	opacity: 0.5;
}

.place,
.column__content {
	margin-block: 0;
}

.place {
	font-style: italic;
	opacity: 0.5;
}
</style>
