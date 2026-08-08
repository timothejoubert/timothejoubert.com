<script setup lang="ts">
defineProps<{
	name: string
	mode?: 'svg' | 'css'
	size?: number | string
	prefix?: string
}>()
</script>

<template>
    <NuxtIcon
        aria-hidden="true"
        :name="`${prefix || 'material-symbols'}:${name}`"
        :size="size"
        :mode="mode"
    />
</template>
