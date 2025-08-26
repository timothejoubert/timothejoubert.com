<script lang="ts" setup>
import type { VWrapperProps } from '~/components/atoms/VWrapper.vue'

defineProps<{
	label: string
} & VWrapperProps>()
</script>

<template>
    <VWrapper
        :wrapper="wrapper || 'span'"
        :class="$style.root"
    >
        {{ label }}
    </VWrapper>
</template>

<style lang="scss" module>
.root {
	padding: 3px 8px;
	background-color: var(--color-content);
	color: var(--color-background);
	border-radius: 50vmax;
    font-size: 12px;
    font-weight: 400;
}
</style>
