<template>
    <div :class="$style.root" class="container">
        <button>test</button>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VSettings',
    computed: {
        isOpen() {
            return this.$store.state.isSettingsOpen
        },
    },
})
</script>
<style lang="scss" module>
.root {
    z-index: 2;
    height: $v-settings-height;
    background-color: red;
}
</style>
