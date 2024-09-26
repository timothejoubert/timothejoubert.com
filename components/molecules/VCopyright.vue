<script  lang="ts" setup>

defineProps<{
    content: string
}>()
</script>

<template>
    <div :class="$style.root">
        <button :aria-label="$t('see_copyright')">i</button>
        <div :class="$style.content">{{content}}</div>
    </div>
</template>

<style lang="scss" module>
.root {
    --v-copyright-button-width: #{rem(14)};

    position: absolute;
    right: rem(12);
    bottom: rem(12);
}

.button {
    display: flex;
    width: var(--v-copyright-button-width);
    height: var(--v-copyright-button-width);
    align-items: center;
    justify-content: center;
    background-color: white;
    color: black;
}

.content {
    position: absolute;
    right: 0;
    bottom: calc(var(--v-copyright-button-width) + #{rem(12)});
    background-color: white;
}
</style>
