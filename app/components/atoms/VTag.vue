<script lang="ts" setup>
import type { VWrapperElement } from '~/components/atoms/VWrapper.vue'

defineProps<{
	label: string | null
    wrapper?: VWrapperElement
}>()
</script>

<template>
    <VWrapper
        :wrapper="wrapper || 'span'"
        class="text-label"
        :class="$style.root"
    >
        {{ label }}
    </VWrapper>
</template>

<style lang="scss" module>
.root {
	padding: 3px 8px;
	border-radius: 50vmax;
	background-color: var(--color-content);
	color: var(--color-background);
}
</style>
