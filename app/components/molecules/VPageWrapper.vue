<script lang="ts" setup>
import { SKIP_LINKS } from '~/constants/skip-links'

const route = useRoute()
const hasSubRoute = computed(() => !!route.params.uid)
</script>
<template>
    <component
		:is="hasSubRoute ? 'div' : 'main'"
		:id="hasSubRoute ? undefined : SKIP_LINKS.main.elementId "
	>
		<slot />
	</component>
</template>
