<template>
    <div :class="$style.root">
        <p class="text-h1">text de h1</p>
        <hr>
        <p class="text-h2">text de h2</p>
        <hr>
        <p class="text-h3">text de h3</p>
        <hr>
        <p class="text-h4">text de h4</p>
        <hr>
        <p class="text-h5">text de h5</p>
        <hr>
        <p class="text-over-title-l">text de text-over-title-l</p>
        <hr>
        <p class="text-over-title-m">text de text-over-title-m</p>
        <hr>
        <p class="text-over-title-s">text de text-over-title-s</p>
        <hr>
        <p class="text-body-l">text de body l</p>
        <hr>
        <p class="text-body-m">text de body m</p>
        <hr>
        <p class="text-body-s">text de body s</p>
        <hr>
        <p class="text-body-xs">text de body xs</p>
        <hr>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VStylePreview',
})
</script>

<style lang="scss" module>
.root {
    position: relative;

    & > p {
        margin-block: rem(15);
    }
}
</style>
