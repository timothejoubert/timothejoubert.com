<script lang="ts" setup>
import type { AboutDocument } from '~~/prismicio-types'
import { getFilledLinkToWeb } from '~/utils/prismic/link-field'

const props = defineProps<{
	document: AboutDocument
}>()

const { t } = useI18n()

const page = computed(() => props.document.data)
const columns = computed(() => [
	{ key: 'formations', label: t('about_page.formations'), entries: page.value.formations ?? [] },
	{ key: 'experiences', label: t('about_page.experiences'), entries: page.value.experiences ?? [] },
])
</script>

<template>
    <main
        id="main-content"
        class="grid"
        :class="$style.root"
    >
        <LazyVHighlightedText
            v-if="page.content"
            :field="page.content"
            wrapper="p"
            :class="$style.content"
        />
        <div
			v-if="columns.some((column) => column.entries.length)"
			:class="$style.columns"
		>
            <template
                v-for="column in columns"
                :key="column.key"
            >
                <section
                    v-if="column.entries.length"
                    :class="$style.column"
                >
                    <h2 :class="$style['column-title']">
                        {{ column.label }}
                    </h2>
                    <div
                        v-for="(entry, i) in column.entries"
                        :key="i"
                        :class="$style.entry"
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
    </main>
</template>

<style lang="scss" module>
.root {
	padding-top: 15vh;
    row-gap: 82px;
}

.content {
    max-width: 60ch;
	font-family: #{$fraktion-mono-family};
	font-size: 24px;
	font-weight: 300;
	grid-column: 1 / -1;
    line-height: 1.7;
    margin-block: 0;
	margin-inline: auto;
	text-align: center;
}

.columns {
	position: relative;
	display: grid;
	grid-column: 1 / -1;
	grid-template-columns: subgrid;
	row-gap: 60px;

	&::before {
		position: absolute;
		top: 0;
		bottom: 0;
		left: calc(var(--gutter) * -0.5);
		width: 1PX;
		background-color: currentcolor;
		content: '';
		grid-column: 7;
		opacity: 0.2;
	}
}

.column {
	grid-column: 1 / -1;

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
	opacity: 0.5;
	text-transform: uppercase;
}

.entry {
	& + & {
		margin-top: 32px;
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
