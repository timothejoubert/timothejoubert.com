<template>
    <div :class="[$style.root, isOverflow && $style['root--overflow']]">
        <slot class="scroll-inner" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { VueConstructor } from 'vue'

interface Component extends Vue {
    resizeObserver: ResizeObserver | null
}

export default (Vue as VueConstructor<Component>).extend({
    name: 'VScrollOverflow',
    data() {
        return {
            isOverflow: false,
        }
    },
    mounted() {
        this.createResizeObserver()
    },
    beforeDestroy() {
        this.disposeResizeObserver()
    },
    methods: {
        createResizeObserver() {
            const innerElement = this.getSlotElement()
            if (!innerElement) return

            this.resizeObserver = new ResizeObserver(this.onResizeObserverChange)
            this.resizeObserver.observe(innerElement)
        },
        disposeResizeObserver() {
            this.resizeObserver?.disconnect()
            this.resizeObserver = null
        },
        getSlotElement(): HTMLElement | undefined {
            const slot = this.$slots.default?.[0] as HTMLElement | Vue | undefined
            return (slot as HTMLElement)?.nodeType === 1 && typeof (slot as HTMLElement)?.style === 'object'
                ? (slot as HTMLElement)
                : (((slot as Vue)?.$el || (slot as { elm?: HTMLElement })?.elm) as HTMLElement)
        },
        async onResizeObserverChange([entry]: ResizeObserverEntry[]) {
            await this.$nextTick()

            this.isOverflow = entry.target.scrollHeight > entry.target.clientHeight
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;

    & > * {
        @include scroll-bar-hidden;

        --scroll-section-max-height: #{rem(160)};
    }

    &--overflow {
        padding-bottom: rem(15);

        &::after {
            position: absolute;
            background: linear-gradient(to top, var(--theme-background-color) 0%, transparent 30%);
            content: '';
            inset: 0;
            pointer-events: none;
        }
    }
}
</style>
