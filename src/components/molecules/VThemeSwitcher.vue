<template>
    <div :class="$style.root">
        <v-theme-button
            v-for="(theme, i) in themes"
            :id="theme.id"
            :key="theme.id"
            :colors="theme.colors"
            :is-selected="theme.id === activeTheme"
            :class="$style.buttons"
            :style="{ '--theme-button-index': i * 50 + 'ms' }"
            @click="onThemeChanged"
        />
        <v-theme-button :colors="['#EBEBEB', '#AAAAAA', '#494949']" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getArrayFormattedTheme, getObjectFormattedTheme, getPredefinedThemes } from '~/utils/theme'
import MutationType from '~/constants/mutation-type'

const predefinedThemes = getPredefinedThemes()

interface ThemeButton {
    id?: string
    colors?: string[]
}

export default Vue.extend({
    name: 'VThemeSwitcher',
    data() {
        return {
            activeTheme: null as string | null,
        }
    },
    computed: {
        themes(): ThemeButton[] {
            return Object.entries(predefinedThemes).map(([key, values]) => {
                const colors = values
                    .sort((colorA, _colorB) => {
                        if (colorA.key === 'foreground') return -2
                        else if (colorA.key === 'background') return 1
                        else return 0
                    })
                    .map((colors) => colors.value)
                return {
                    id: key,
                    colors,
                }
            })
        },
    },
    methods: {
        resetInterface() {
            this.activeTheme = null
            this.updateColors(getArrayFormattedTheme())
            this.$store.commit(MutationType.UI_THEME, getObjectFormattedTheme())
        },
        onThemeChanged(themeId: string | undefined) {
            if (!themeId) return
            this.activeTheme = themeId
            const selectedTheme = predefinedThemes?.[themeId]
            selectedTheme && this.updateColors(selectedTheme)
        },
        updateColors(colors: { key: string; value: string }[]) {
            colors.forEach((color) => {
                this.$store.commit(MutationType.UI_THEME, { key: color.key, value: color.value })
            })
        },
    },
})
</script>
<style lang="scss" module>
.root {
    display: flex;
    gap: rem(4);
}

.buttons {
    opacity: 0;
    pointer-events: none;
    transition: 0.3s ease(out-quad) var(--theme-button-index, 0ms);
    transition-property: opacity, translate;
    translate: rem(20) 0;

    .root:hover & {
        opacity: 1;
        pointer-events: initial;
        translate: 0 0;
    }
}
</style>
