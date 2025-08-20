<script lang="ts" setup>
import type { AboutDocument } from '~~/prismicio-types'

const props = defineProps<{
	document: AboutDocument
}>()

const page = computed(() => props.document.data)
</script>

<template>
    <div
        class="grid-container"
        :class="$style.root"
    >
        <VHighlightedText
            :field="page.content"
            wrapper="h2"
            :class="$style.content"
        />
        <template v-if="page.sections?.length">
            <section
                v-for="(section, i) in page.sections"
                :key="i"
                :class="$style.section"
            >
                <h3 :class="$style.title">
                    {{ section.title }}
                </h3>
                <VText
                    v-if="section.content"
                    :content="section.content"
                    :class="$style.section__content"
                />
            </section>
        </template>
    </div>
</template>

<style lang="scss" module>
.root {
	display: grid;
	grid-template-columns: 1fr 1fr;

	// max-width: 100ch;
}

.content {
	margin-top: 200px;
	grid-column: 1 / -1;
	margin-inline: auto;
	text-align: center;
}

.section {
	position: relative;
	margin-top: 120px;
}
</style>
