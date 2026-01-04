<script setup lang="ts">
defineProps({
	name: {
		type: String,
		required: true,
	},
	mode: {
		type: String as PropType<'svg' | 'css'>,
		required: false,
		default: null,
	},
	size: {
		type: [Number, String],
		required: false,
		default: null,
	},
	prefix: {
		type: String,
	},
})
</script>

<template>
    <NuxtIcon
        aria-hidden="true"
        :name="`${prefix || 'icon'}:${name}`"
        :size="size"
        :mode="mode"
    />
</template>
