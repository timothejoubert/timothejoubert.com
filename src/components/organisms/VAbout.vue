<template>
    <div :class="$style.root">
        <v-about-toggle />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VAbout',
    computed: {
        commonContent() {
            return this.$store.state
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: sticky;
    bottom: 0;
}
</style>
