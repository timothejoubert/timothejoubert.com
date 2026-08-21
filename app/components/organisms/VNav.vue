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
	position: fixed;
    z-index: 1001;
    bottom: calc(var(--app-padding-bottom) * 0.5);
	display: flex;
	gap: 20px;
    place-self: flex-end center;
    translate: 0 50%;

    &::before {
        position: absolute;
        display: block;
        backdrop-filter: blur(1px);
        content: '';
        inset: -60% -30%;
        mask-image: radial-gradient(closest-side, black 40%, transparent 100%);
        pointer-events: none;
    }
}
</style>
