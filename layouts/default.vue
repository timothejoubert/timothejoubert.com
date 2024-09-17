<script  lang="ts" setup>

</script>

<template>
    <div :class="$style.root">
        default layout
        <slot />
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
