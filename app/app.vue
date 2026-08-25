<script lang="ts" setup>
await usePrismicPersonSchemaOrg()
</script>

<template>
	<NuxtRouteAnnouncer />
	<NuxtLoadingIndicator color="#DBE6EC" />

	<VSkipLink />

	<VNav />

	<NuxtPage />

	<DevOnly>
		<VGridVisualizer />
	</DevOnly>
</template>
