<script lang="ts" setup>
</script>

<template>
    <header :class="$style.root">
        <VNav />
        <VSettingModal />
    </header>
</template>

<style lang="scss" module>
.root {
	display: flex;
	gap: 20px;
}
</style>
