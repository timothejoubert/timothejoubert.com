<script lang="ts" setup>

</script>

<template>
    <div :class="$style.root">
        <slot />
    </div>
</template>

<style lang="scss" module>
.root {
	margin: calc(var(--gutter));
	padding: calc(var(--gutter));
	border-radius: 10px;
	background-color: var(--color-surface);
}
</style>
