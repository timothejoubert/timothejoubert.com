<script lang="ts" setup>
const { isDragging, onPointerDown } = useDragScroll()
</script>

<template>
    <div
        :class="[$style.root, isDragging && $style['root--dragging']]"
        @pointerdown="onPointerDown"
    >
        <slot />
    </div>
</template>

<style lang="scss" module>
.root {
    overflow: auto hidden;
    cursor: grab;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    &--dragging {
        cursor: grabbing;
        user-select: none;
    }
}
</style>
