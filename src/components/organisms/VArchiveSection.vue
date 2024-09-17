<template>
    <VCollapsable :class="$style.root" wrapper-tag="section" class="container">
        <template #label>
            <v-interactive-text class="text-body-l" :content="'Archives'" @click.native="isOpen = !isOpen" />
        </template>
        <VArchiveContent :class="$style.content" />
    </VCollapsable>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VArchiveSection',
    data() {
        return {
            isOpen: true,
        }
    },
})
</script>

<style lang="scss" module>
.root {
    --v-collapsed-transition-duration: 1.4s;

    margin-block: rem(10) rem(60);
}

.content {
    margin-top: rem(28);
}
</style>
