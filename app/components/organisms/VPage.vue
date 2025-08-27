<script lang="ts" setup>

</script>

<template>
    <div :class="$style.root">
        <slot />
    </div>
</template>

<style lang="scss" module>
.root {
	padding: calc(var(--gutter));
	border-radius: 10px;
	margin: calc(var(--gutter));
	background-color: var(--color-surface);
}
</style>
