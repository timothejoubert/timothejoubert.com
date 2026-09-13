<script lang="ts" setup>
type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
const DIRECTIONS: ResizeDirection[] = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

const props = withDefaults(defineProps<{
    storageKey?: string
    minWidth?: number
    minHeight?: number
    containerSelector?: string
    ariaLabel?: string
    position?: 'fixed' | 'absolute'
}>(), {
    storageKey: 'v-window',
    minWidth: 330,
    minHeight: 400,
    position: 'fixed',
})

const emit = defineEmits<{ close: [] }>()

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const headEl = useTemplateRef<HTMLElement>('headEl')
const containerEl = ref<HTMLElement | null>(null)

// `arrivedState.bottom` is also true when the content doesn't overflow at all.
const { arrivedState } = useScroll(rootEl)
const canScrollDown = computed(() => !arrivedState.bottom)

// Below `md`, a saved desktop drag/resize position can place the whole window off-screen —
// the responsive layout (full width, anchored to the top) takes over instead, so saved
// position/size are ignored and the interactions themselves are disabled.
const { width: viewportWidth } = useWindowSize()
const isMobile = computed(() => viewportWidth.value < breakpoint('md'))

// Modal-like behaviour: this window visually covers the page behind it, so it needs
// dialog semantics — focus moves in on mount, is trapped while open, and returns to
// whatever triggered it (e.g. the project card link) once the consumer closes it.
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
let previouslyFocused: HTMLElement | null = null

function getFocusable() {
    return rootEl.value ? Array.from(rootEl.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) : []
}

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        e.stopPropagation()
        emit('close')
        return
    }

    if (e.key !== 'Tab') return

    const focusable = getFocusable()
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
    }
    else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
    }
}

onMounted(() => {
    previouslyFocused = document.activeElement as HTMLElement | null
    rootEl.value?.focus()
})

onBeforeUnmount(() => {
    previouslyFocused?.focus?.()
})

// A `fixed` window is anchored to the viewport and must not receive any
// container — useDraggable's scroll-compensation math (`container.scrollTop`)
// is only correct for an element nested inside a scrolling container, and
// corrupts a fixed element's position as soon as the page itself is scrolled.
// `useResizable` already falls back to viewport bounds when container is null.
onMounted(() => {
    containerEl.value = props.position === 'absolute' && props.containerSelector
        ? document.querySelector<HTMLElement>(props.containerSelector)
        : null
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
    if (!dragging) return

    // useDraggable's x/y only update on pointermove, not on the initial pointerdown —
    // without this sync, the first drag ever (no saved position, x/y still at their
    // {0, 0} default) would flash the window to the top-left corner for one frame
    // before the first move corrects it.
    if (!hasDragged.value && rootEl.value) {
        const rect = rootEl.value.getBoundingClientRect()
        x.value = rect.left
        y.value = rect.top
    }

    hasDragged.value = true
})

watch([x, y], ([newX, newY]) => {
    if (hasDragged.value && !isMobile.value) savedPosition.value = { x: newX, y: newY }
})

// Resize
const { startResize, isResizing, style: resizeStyle } = useResizable(rootEl, {
    containerEl,
    minWidth: props.minWidth,
    minHeight: props.minHeight,
    storageKey: `${props.storageKey}-size`,
    position: { x, y, onActivate: () => { hasDragged.value = true } },
    disabled: isMobile,
})

// Combined style
const windowStyle = computed(() => ({
    '--v-window-display': props.position,
    ...(hasDragged.value && !isMobile.value && { left: `${x.value}px`, top: `${y.value}px` }),
    ...resizeStyle.value,
}))
</script>

<template>
    <div
        ref="rootEl"
        role="dialog"
        aria-modal="true"
        :aria-label="ariaLabel"
        tabindex="-1"
        :class="[$style.root, isResizing && $style['root--resizing']]"
        :style="windowStyle"
        @keydown="onKeydown"
    >
        <div
            v-for="dir in DIRECTIONS"
            :key="dir"
            :class="$style[`resize-handle--${dir}`]"
            @pointerdown.stop="startResize($event, dir)"
        />

        <div :class="$style.inner">
            <div
                ref="headEl"
                :class="$style.head"
            >
                <slot name="head" />
            </div>
            <slot />
        </div>

        <div
            v-if="canScrollDown"
            :class="$style.fade"
        />
    </div>
</template>

<style lang="scss" module>
$handle-edge: 8px;
$handle-corner: 14px;
$fade-height: 48px;

.root {
    position: var(--v-window-display, fixed);
    overflow: hidden auto;
    border: 1PX solid var(--color-surface);
    border-radius: 12px;
    background-color: var(--color-background);
    box-shadow: -5px 5px 20PX 10PX rgb(0 0 0 / 20%);

    // `overflow: hidden` + `border-radius` alone clip via a fast compositor shortcut that
    // can desync by a subpixel from a `position: sticky` descendant's own scroll-driven
    // layer (known Chromium/WebKit rendering bug), letting scrolled content bleed through
    // the rounded corners. Adding a mask forces the browser onto the slower but correct
    // full-mask compositing path instead of that shortcut.
    mask-image: radial-gradient(white, black);
    -ms-overflow-style: none;
    overscroll-behavior: contain;
    scrollbar-width: none;

    &::-webkit-scrollbar {
        display: none;
    }

    &--resizing {
        pointer-events: none;
    }
}

.inner {
    width: 100%;
}

.fade {
    position: sticky;
    z-index: 1;
    bottom: 0;
    height: $fade-height;
    margin-top: -$fade-height;
    background: linear-gradient(to bottom, transparent, rgb(0 0 0 / 60%));
    border-end-end-radius: inherit;
    border-end-start-radius: inherit;
    pointer-events: none;
}

.head {
    position: sticky;
    z-index: 1;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-surface);
    color: var(--color-content);
    cursor: move;

    @include media('<md') {
        cursor: default;
    }

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

    @include media('<md') {
        display: none;
    }
}

.resize-handle--n {
    top: 0;
    right: $handle-corner;
    left: $handle-corner;
    height: $handle-edge;
    cursor: n-resize;
}

.resize-handle--s {
    right: $handle-corner;
    bottom: 0;
    left: $handle-corner;
    height: $handle-edge;
    cursor: s-resize;
}

.resize-handle--e {
    top: $handle-corner;
    right: 0;
    bottom: $handle-corner;
    width: $handle-edge;
    cursor: e-resize;
}

.resize-handle--w {
    top: $handle-corner;
    bottom: $handle-corner;
    left: 0;
    width: $handle-edge;
    cursor: w-resize;
}

.resize-handle--ne {
    top: 0;
    right: 0;
    width: $handle-corner;
    height: $handle-corner;
    cursor: ne-resize;
}

.resize-handle--nw {
    top: 0;
    left: 0;
    width: $handle-corner;
    height: $handle-corner;
    cursor: nw-resize;
}

.resize-handle--se {
    right: 0;
    bottom: 0;
    width: $handle-corner;
    height: $handle-corner;
    cursor: se-resize;
}

.resize-handle--sw {
    bottom: 0;
    left: 0;
    width: $handle-corner;
    height: $handle-corner;
    cursor: sw-resize;
}
</style>
