<template>
    <component :is="tag || 'div'" :class="$style.root">
        <v-split-letters variable-font :content="word" @hook:mounted="setLetters" />
    </component>
</template>

<script lang="ts">
import Vue from 'vue'
import type { VueConstructor } from 'vue'
import { getDistance, mapRange } from '~/utils/utils'
import eventBus from '~/utils/event-bus'

interface Component {
    letters: { element: HTMLElement; xCenter: number; yCenter: number }[]
    wrapperHeight: number
    listenerInit: boolean
}

const X_RANGE = 60
const Y_RANGE = 40

export default (Vue as VueConstructor<Vue & Component>).extend({
    name: 'VInteractiveText',
    props: {
        tag: { type: String, default: 'div' },
        content: String,
        triggerEvent: String,
    },
    computed: {
        word() {
            return (this.content || this.$slots?.default?.[0]?.text || '').trimStart()
        },
    },
    created() {
        this.wrapperHeight = 0
        this.listenerInit = false
    },
    mounted() {
        this.wrapperHeight = this.$el.getBoundingClientRect().height ?? 40

        if (this.triggerEvent) eventBus.$on(this.triggerEvent, this.init)
        else this.init()
    },
    beforeDestroy() {
        this.removeListener()
        this.triggerEvent && eventBus.$off(this.triggerEvent, this.init)
    },
    methods: {
        init() {
            if (this.listenerInit) return

            this.setLetters()
            this.initListener()
        },
        initListener() {
            ;(this.$el as HTMLElement).addEventListener('mousemove', this.onMouseMove)
            ;(this.$el as HTMLElement).addEventListener('mouseleave', this.onMouseLeave)
        },
        removeListener() {
            ;(this.$el as HTMLElement).removeEventListener('mousemove', this.onMouseMove)
            ;(this.$el as HTMLElement).removeEventListener('mouseleave', this.onMouseLeave)
        },
        setLetters() {
            const letters = Array.from(this.$el.querySelectorAll('.split-word-letter')) as HTMLElement[]
            this.letters = letters.map((letter) => {
                return {
                    element: letter,
                    xCenter: this.getLetterCenter(letter, 'left'),
                    yCenter: this.getLetterCenter(letter, 'top'),
                }
            })
        },
        onMouseMove(event: MouseEvent) {
            this.letters.forEach((letter) => {
                const mouseDist = getDistance(event.clientX, letter.xCenter, event.clientY, letter.yCenter)
                const dist = isNaN(mouseDist) ? 0 : parseInt(mouseDist.toFixed(2))

                const weight = mapRange(Math.min(dist, X_RANGE), 0, X_RANGE, 900, 300)
                const italic = mapRange(Math.min(dist, Y_RANGE), 0, Y_RANGE, 10, 0)

                letter.element.style.setProperty('--font-weight', weight.toString())
                letter.element.style.setProperty('--font-italic', italic.toString())
            })
        },
        onMouseLeave() {
            this.letters.forEach((letter) => {
                letter.element.style.setProperty('--font-weight', '300')
                letter.element.style.setProperty('--font-italic', '0')
            })
        },
        getLetterCenter(element: HTMLElement, axe: 'left' | 'top') {
            let result = 0
            if (axe === 'top') {
                result =
                    this.$el.getBoundingClientRect().top +
                    parseInt(getComputedStyle(this.$el).paddingTop) +
                    element.offsetTop +
                    element.getBoundingClientRect().height / 2
            } else {
                result =
                    this.$el.getBoundingClientRect().left +
                    parseInt(getComputedStyle(this.$el).paddingLeft) +
                    element.offsetLeft +
                    element.getBoundingClientRect().width / 2
            }
            return parseInt(result.toFixed(2))
        },
    },
})
</script>
<style lang="scss" module>
.root {
    display: inline-block;
}
</style>
