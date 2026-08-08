
<script lang="ts" setup>
import { getDistance, mapRange } from '~/utils/math'
import { getSlotsInnerText } from '~/utils/vue/get-slot-children-text'

const props = defineProps<{
    tag?: string
    content: string
}>()

const letters = ref<{
    element: HTMLElement
    xCenter: number
    yCenter: number
}[]>([])

const rootEl = useTemplateRef<HTMLElement>('rootRef')
const { width } = useWindowSize()
watch(width, setLetters)

const X_RANGE = 60
const Y_RANGE = 40

const slots = useSlots()
const _content = computed(() => {
    const text = props.content || getSlotsInnerText(slots) || ''
    return text.trimStart()
})

onMounted(() => {
    setLetters()

    rootEl.value?.addEventListener('mousemove', onMouseMove)
    rootEl.value?.addEventListener('mouseleave', onMouseLeave)
})

onBeforeUnmount(() => {
    rootEl.value?.removeEventListener('mousemove', onMouseMove)
    rootEl.value?.removeEventListener('mouseleave', onMouseLeave)
})

function getLetterCenter(element: HTMLElement, axe: 'left' | 'top') {
    let result = 0
    if(!rootEl.value) return result

    if (axe === 'top') {
        result =
            rootEl.value.getBoundingClientRect().top +
            parseInt(getComputedStyle(rootEl.value).paddingTop) +
            element.offsetTop +
            element.getBoundingClientRect().height / 2
    } else {
        result =
            rootEl.value.getBoundingClientRect().left +
            parseInt(getComputedStyle(rootEl.value).paddingLeft) +
            element.offsetLeft +
            element.getBoundingClientRect().width / 2
    }

    return parseInt(result.toFixed(2))
}


function setLetters() {
    const lettersElements = Array.from(rootEl.value?.querySelectorAll('.split-text-char') || []) as HTMLElement[]

    letters.value = lettersElements.map((letter) => {
        return {
            element: letter,
            xCenter: getLetterCenter(letter, 'left'),
            yCenter: getLetterCenter(letter, 'top'),
        }
    })

}

function onMouseMove(event: MouseEvent) {
    letters.value.forEach((letter) => {
        const mouseDist = getDistance(event.clientX, letter.xCenter, event.clientY, letter.yCenter)
        const dist = isNaN(mouseDist) ? 0 : parseInt(mouseDist.toFixed(2))

        const weight = mapRange(Math.min(dist, X_RANGE), 0, X_RANGE, 900, 300)
        const italic = mapRange(Math.min(dist, Y_RANGE), 0, Y_RANGE, 10, 0)

        letter.element.style.setProperty('--font-weight', weight.toString())
        letter.element.style.setProperty('--font-italic', italic.toString())
    })
}

function onMouseLeave() {
    letters.value.forEach((letter) => {
        letter.element.style.removeProperty('--font-weight')
        letter.element.style.removeProperty('--font-italic')
        // letter.element.style.setProperty('font-variation-settings', `"wght" 300 "ital" 0`)
    })
}
</script>

<template>
    <component
        :is="tag || 'div'"
        ref="rootRef"
        :class="$style.root"
    >
        <VSplitText
            render="chars"
            :content="_content"
            @hook:mounted="setLetters"
        />
    </component>
</template>
<style lang="scss" module>
.root {

    :global(.split-text-char) {
        // TODO: use monospace font for avoid jumping letters when changing font-weight
        // font-family: monospace;
        font-variation-settings:
            'wght' var(--font-weight, 400),
            'ital' var(--font-italic, 0);
        transition: font-variation-settings 0.3s ease(out-quad);
    }
}
</style>
