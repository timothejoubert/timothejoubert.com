<script lang="ts" setup>
import type { HomePageDocument } from '~~/prismicio-types'

defineProps<{
	document: HomePageDocument
}>()

// A project modal (nested route) renders its own <h1> for the project title — the listing's
// own heading is demoted to <h2> in that case so the page only ever has one <h1>.
const route = useRoute()
const hasSubRoute = computed(() => !!route.params.uid)
const headingTag = computed(() => hasSubRoute.value ? 'h2' : 'h1')
</script>

<template>
    <VPageWrapper>
        <component
            :is="headingTag"
            class="visually-hidden"
        >
            {{ document.data.title }}
        </component>
        <VMainProjectListing />
    </VPageWrapper>
</template>
