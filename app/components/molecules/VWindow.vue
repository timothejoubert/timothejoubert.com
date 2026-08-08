<script lang="ts" setup>
type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
const DIRECTIONS: ResizeDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

const props = withDefaults(defineProps<{
    storageKey?: string
    minWidth?: number
    minHeight?: number
    containerSelector?: string
}>(), {
    storageKey: 'v-window',
    minWidth: 300,
    minHeight: 400,
})

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const headEl = useTemplateRef<HTMLElement>('headEl')
const containerEl = ref<HTMLElement | null>(null)

onMounted(() => {
    if(!props.containerSelector) return null
    containerEl.value = document.querySelector(props.containerSelector) as HTMLElement | null
})

// Drag
const savedPosition = useCookie<{ x: number, y: number } | null>(
    `${props.storageKey}-position`,
    { default: () => null },
)
const hasDragged = ref(!!savedPosition.value)

const { x, y, isDragging } = useDraggable(rootEl, {
    handle: headEl,
    containerElement: containerEl,
    ...(savedPosition.value && { initialValue: savedPosition.value }),
})

watch(isDragging, (dragging) => {
    if (dragging) hasDragged.value = true
})

watch([x, y], ([newX, newY]) => {
    if (hasDragged.value) savedPosition.value = { x: newX, y: newY }
})

// Resize
const { startResize, isResizing, style: resizeStyle } = useResizable(rootEl, {
    containerEl,
    minWidth: props.minWidth,
    minHeight: props.minHeight,
    storageKey: `${props.storageKey}-size`,
    position: { x, y, onActivate: () => { hasDragged.value = true } },
})

// Combined style
const windowStyle = computed(() => ({
    ...(hasDragged.value && { left: `${x.value}px`, top: `${y.value}px` }),
    ...resizeStyle.value,
}))
</script>

<template>
    <div
        ref="rootEl"
        :class="[$style.root, isResizing && $style['root--resizing']]"
        :style="windowStyle"
    >
        <div
            v-for="dir in DIRECTIONS"
            :key="dir"
            :class="$style[`resize-handle--${dir}`]"
            @pointerdown.stop="startResize($event, dir)"
        />

        <div :class="$style.inner">
            <div ref="headEl" :class="$style.head">
                <slot name="head" />
            </div>
            <slot />
        </div>
    </div>
</template>

<style lang="scss" module>
$handle-edge: 4px;
$handle-corner: 10px;

.root {
    position: absolute;
    border: 1PX solid var(--color-surface);
    border-radius: 12px;
    background-color: var(--color-background);

    &--resizing {
        pointer-events: none;
    }
}

.inner {
    overflow: auto;
    width: 100%;
    height: 100%;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }
}

.head {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: inherit;
    background-color: var(--color-surface);
    color: var(--color-content);
    cursor: move;

    &::before {
        position: absolute;
        top: -3px;
        right: -5px;
        left: -5px;
        display: block;
        height: 15px;
        background-color: var(--color-surface);
        content: '';
        pointer-events: none;
    }
}

// Resize handles
[class*='resize-handle--'] {
    position: absolute;
    z-index: 10;

    .root--resizing & {
        pointer-events: auto;
    }
}

.resize-handle--n  { top: 0; right: $handle-corner; left: $handle-corner; height: $handle-edge; cursor: n-resize; }
.resize-handle--s  { right: $handle-corner; bottom: 0; left: $handle-corner; height: $handle-edge; cursor: s-resize; }
.resize-handle--e  { top: $handle-corner; right: 0; bottom: $handle-corner; width: $handle-edge; cursor: e-resize; }
.resize-handle--w  { top: $handle-corner; bottom: $handle-corner; left: 0; width: $handle-edge; cursor: w-resize; }
.resize-handle--ne { top: 0; right: 0; width: $handle-corner; height: $handle-corner; cursor: ne-resize; }
.resize-handle--nw { top: 0; left: 0; width: $handle-corner; height: $handle-corner; cursor: nw-resize; }
.resize-handle--se { right: 0; bottom: 0; width: $handle-corner; height: $handle-corner; cursor: se-resize; }
.resize-handle--sw { bottom: 0; left: 0; width: $handle-corner; height: $handle-corner; cursor: sw-resize; }
</style>
