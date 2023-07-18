<template functional>
    <div :class="$style.root">
        <div :class="$style.body">
            <div :class="$style.stars">
                <div :class="$style.star"></div>
                <div :class="[$style.star, $style['star--second']]"></div>
            </div>
            <div :class="$style.word" class="text-h2">
                <v-split-words content="Content de vous revoir !" />
            </div>
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
    top: 0;
    left: 0;
    display: flex;
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    align-items: center;
    justify-content: center;
    pointer-events: none;

    &::after {
        position: absolute;
        z-index: -1;
        background-color: rgba(#000, 0.7);
        content: '';
        inset: 0;
    }
}

.body {
    position: relative;
    display: flex;
    width: rem(200);
    height: rem(200);
    align-items: center;
    justify-content: center;
    border-radius: 100%;
}

.stars {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: rotate 6s infinite linear;
    inset: 0;
}

@keyframes rotate {
    to {
        rotate: 90deg;
    }
}

.star {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--theme-accent-color);
    border-radius: rem(8);

    &::before,
    &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--theme-accent-color);
        border-radius: rem(8);
        content: '';
    }

    &::before {
        rotate: 30deg;
    }
    &::after {
        rotate: 60deg;
    }

    &--second {
        rotate: 15deg;
    }
}

.word {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: rem(4);
    color: var(--theme-background-color);

    :global(.split-word-letter) {
        animation: wave-font 1s calc(var(--letter-index) * 200ms - 2s) ease(out-quad) alternate infinite;
    }
}

@keyframes wave-font {
    from {
        font-variation-settings: 'wght' 100, 'ital' 0;
    }
    to {
        font-variation-settings: 'wght' 900, 'ital' 4;
    }
}
</style>
