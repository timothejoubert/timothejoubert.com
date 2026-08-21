<script lang="ts" setup>
import type { AboutDocument } from '~~/prismicio-types'

const props = defineProps<{
	document: AboutDocument
}>()

const page = computed(() => props.document.data)
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
			v-if="page.sections?.length"
			:class="$style.sections"
		>
            <section
                v-for="(section, i) in page.sections"
                :key="i"
                :class="$style.section"
            >
                <h2 :class="$style.title">
                    {{ section.title }}
                </h2>
                <LazyVText
                    v-if="section.content"
                    :content="section.content"
                />
            </section>
        </div>
    </main>
</template>

<style lang="scss" module>
.root {
	padding-top: 20vh;
    row-gap: 82px;
}

.content {
    max-width: 60ch;
	font-family: #{$fraktion-mono-family};
	font-size: 26px;
	font-weight: 300;
	grid-column: 1 / -1;
    line-height: 1.7;
    margin-block: 0;
	margin-inline: auto;
	text-align: center;
}

.sections {
	position: relative;
	display: grid;
	grid-column: 1 / -1;
	grid-template-columns: subgrid;

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

.section {
	position: relative;
    grid-column: 1 / -1;

    a {
        color: inherit;
    }

	em {
		min-height: 2lh;
	}

    @include media('>=lg') {
        &:nth-of-type(odd) {
			left: -20px;
            grid-column: 4 / span 3;
			text-align: right;
        }

        &:nth-of-type(even) {
			left: 20px;
            grid-column: 7 / span 3;
        }
    }
}

.title {
	margin-block: 0 20px;
}
</style>
