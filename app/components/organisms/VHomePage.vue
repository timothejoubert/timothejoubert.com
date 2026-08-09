<script lang="ts" setup>
import type { HomePageDocument } from '~~/prismicio-types'

defineProps<{
	document: HomePageDocument
}>()
</script>

<template>
    <main id="main-content">
        <h1 class="visually-hidden">
            {{ document.data.title }}
        </h1>
        <VMainProjectListing />
    </main>
</template>
