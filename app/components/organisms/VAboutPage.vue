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
        <template v-if="page.sections?.length">
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
        </template>
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

.section {
	position: relative;
    grid-column: 1 / -1;

    a {
        color: inherit;
    }

    @include media('>=lg') {
        &:nth-of-type(odd) {
            grid-column: 4 / span 3;
        }

        &:nth-of-type(even) {
            grid-column: 8 / span 3;
        }
    }

}
</style>
