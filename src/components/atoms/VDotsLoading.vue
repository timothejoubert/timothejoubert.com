<template functional>
    <div :class="$style.root">
        <div :class="$style.dot"></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VDotsLoading',
})
</script>
<style lang="scss" module>
$color-default: rgba(color(white), 0.2);
$color-highlight: rgba(color(white), 0.6);

@mixin dot {
    position: relative;
    display: block;
    width: rem(4);
    height: rem(4);
    animation: dot-flashing 1s infinite alternate;
    animation-play-state: var(--v-dots-loading-state, running);
    background-color: $color-default;
    border-radius: 100vmax;
}

.root {
    position: relative;
    display: inline-flex;
    gap: rem(2);

    &::before,
    &::after {
        @include dot;

        content: '';
    }

    &::before {
        animation-delay: 0s;
    }

    &::after {
        animation-delay: 1s;
    }
}

.dot {
    @include dot;

    animation-delay: 0.5s;
}

@keyframes dot-flashing {
    0% {
        background-color: $color-highlight;
    }
    50%,
    100% {
        background-color: $color-default;
    }
}
</style>
