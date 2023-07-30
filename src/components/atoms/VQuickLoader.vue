<script lang="ts">
import Vue from 'vue'
import type { VNode } from 'vue'

export default Vue.extend({
    name: 'VQuickLoader',
    functional: true,
    render(createElement, context): VNode {
        return createElement('div', { class: [context.$style.root, context.data.class] }, 'T')
    },
})
</script>

<style lang="scss" module>
.root {
    position: absolute;
    display: flex;
    overflow: hidden;
    width: var(--v-quick-loader-width, rem(110));
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border-radius: $v-card-border-radius;
    color: var(--theme-accent-color);
    font-size: var(--v-quick-loader-font-size, rem(62));
    font-weight: 700;
    text-transform: uppercase;

    &::after {
        position: absolute;
        z-index: -1;
        animation: loading-animation 1s infinite alternate ease(in-out-circ);
        background-image: linear-gradient(
            to left,
            rgba(#fff, 0.1) 0%,
            var(--theme-background-color) 50%,
            rgba(#fff, 0.1) 100%
        );
        background-position: 120% 0;
        background-size: 120% 100%;
        content: '';
        inset: -200px;
        rotate: -45deg;
    }
}

@keyframes loading-animation {
    100% {
        background-position: -480% 0;
    }
}
</style>
