/**
 * Enables click-and-drag horizontal scrolling on an element (grab-to-scroll) for pointer
 * devices whose overflow content otherwise only scrolls via wheel/touch. Bind `onPointerDown`
 * to `pointerdown` on the scrollable element itself; move/up are tracked on `window` (via
 * VueUse's `useEventListener`, auto-cleaned on unmount) so dragging past the element's
 * bounds still works. Only intercepts `pointerType === 'mouse'` — touch/pen already scroll
 * this element natively via `overflow: auto`, and hijacking those would fight momentum
 * scrolling.
 */
export function useDragScroll() {
    const isDragging = ref(false)

    let el: HTMLElement | null = null
    let startX = 0
    let startScrollLeft = 0
    let dragged = false

    const DRAG_THRESHOLD = 5 // px — distinguishes an actual drag from a plain click

    function onPointerDown(e: PointerEvent) {
        if (e.pointerType !== 'mouse') return
        el = e.currentTarget as HTMLElement | null
        if (!el) return

        isDragging.value = true
        dragged = false
        startX = e.clientX
        startScrollLeft = el.scrollLeft
    }

    function onPointerMove(e: PointerEvent) {
        if (!isDragging.value || !el) return

        const delta = e.clientX - startX
        if (Math.abs(delta) > DRAG_THRESHOLD) dragged = true
        el.scrollLeft = startScrollLeft - delta
    }

    function stopDragging() {
        if (dragged && el) {
            // Swallow the trailing click so a drag-release doesn't also trigger an
            // ancestor's click handler (e.g. a table row's navigate-to-project click).
            el.addEventListener('click', e => e.stopPropagation(), { capture: true, once: true })
        }
        isDragging.value = false
        el = null
    }

    useEventListener(window, 'pointermove', onPointerMove)
    useEventListener(window, 'pointerup', stopDragging)
    useEventListener(window, 'pointercancel', stopDragging)

    return { isDragging, onPointerDown }
}
