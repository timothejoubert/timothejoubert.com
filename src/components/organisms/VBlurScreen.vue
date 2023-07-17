<template>
    <div :class="$style.root">
        <div :class="$style.word" class="text-h1">
            <v-split-words content="Je vous ai attendu !" />
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VBlurScreen',
})
</script>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--theme-background-color);
    inset: 0;
    padding-inline: 10%;
}

.word {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: rem(4);
    opacity: 0.1;

    :global(.split-word-letter) {
        animation: wave-font 1s calc(var(--letter-index) * 100ms - 2s) ease(out-quad) alternate infinite;
    }
}

@keyframes wave-font {
    from {
        font-variation-settings: 'wght' 100, 'ital' 0;
        scale: 0.6;
    }
    to {
        font-variation-settings: 'wght' 900, 'ital' 4;
        scale: 1;
    }
}
</style>
