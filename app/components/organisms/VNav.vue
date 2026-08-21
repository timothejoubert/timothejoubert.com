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
        content: '';
        inset: -40% -30%;
        pointer-events: none;

        // background: radial-gradient(var(--color-surface) 30%, transparent);
        // backdrop-filter: blur(5px);
    }
}
</style>
