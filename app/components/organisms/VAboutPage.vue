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
            wrapper="h1"
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
	grid-column: 1 / -1;
	margin-inline: auto;
	text-align: center;
    margin-block: 0;
    max-width: 54ch;
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
