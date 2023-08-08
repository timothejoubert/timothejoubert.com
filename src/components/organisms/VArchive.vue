<template>
    <div :class="$style.root" class="container">
        <div :class="$style.title" class="text-body-l">Archive</div>
        <v-archive-list />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VArchive',
})
</script>

<style lang="scss" module>
.root {
    margin-block: rem(60) rem(60);
}

.title {
    margin-bottom: rem(42);
}
</style>
