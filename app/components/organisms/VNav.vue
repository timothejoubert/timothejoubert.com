<script lang="ts" setup>
</script>

<template>
    <div :class="$style.root">
        <VMainNav />
        <VSettingModal />
    </div>
</template>

<style lang="scss" module>
.root {
	display: flex;
	gap: 20px;
}
</style>
