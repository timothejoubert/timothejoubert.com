<template>
    <div :class="$style.root">
        <div :class="$style.word" class="text-h1">
            <v-split-letters :content="title" tag="span" />
        </div>
        <div :class="$style.message">{{ subTitle }}</div>
        <v-button animate size="s" :label="buttonLabel" filled @click="$emit('reset-filter')" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VNoResult',
    props: {
        title: { type: String, default: 'Oups...' },
        subTitle: { type: String, default: 'Aucun résultats' },
        buttonLabel: { type: String, default: 'Reset tous les filtres' },
    },
})
</script>

<style lang="scss" module>
.root {
    display: flex;
    min-height: var(--v-no-result-min-height, calc(100vh - $v-top-bar-height - $v-about-toggle-height));
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: min-height 0.4s ease(out-quad);
}

.word {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: rem(4);
    opacity: 0.1;
    :global(.split-word-letter) {
        animation: wave-font 1s calc(var(--letter-index) * 100ms - 2s) ease(out-quad) alternate infinite;
    }
}

.message {
    margin-bottom: rem(70);
    opacity: 0.6;
}

@keyframes wave-font {
    from {
        font-variation-settings: 'wght' 300, 'ital' 0;
    }
    to {
        font-variation-settings: 'wght' 900, 'ital' 4;
    }
}
</style>
