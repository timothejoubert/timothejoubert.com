<template>
    <div
        :class="[$style.root, isOpen && $style['root--open']]"
        @mouseenter="isOpen = true"
        @mouseleave="isOpen = false"
    >
        <v-theme-button
            :colors="['#EBEBEB', '#494949', '#AAAAAA']"
            aria-label="Ouvrir les différents themes"
            @focusin.native="isOpen = true"
        />
        <v-theme-button
            v-for="(theme, i) in themes"
            :id="theme.id"
            :key="theme.id"
            :inert="!isOpen"
            :colors="theme.colors"
            :is-selected="theme.id === activeTheme"
            :class="$style.buttons"
            :style="{ '--theme-button-index': (themes.length - i) * 50 + 'ms' }"
            switcher
            @click="onThemeChanged"
        />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getArrayFormattedTheme, getPredefinedThemes, getThemeList } from '~/utils/theme'
import MutationType from '~/constants/mutation-type'

const predefinedThemes = getPredefinedThemes()

interface ThemeButton {
    id: string
    colors?: string[]
}

export default Vue.extend({
    name: 'VThemeSwitcher',
    data() {
        return {
            isOpen: false,
            activeTheme: 'default' as string | null,
        }
    },
    computed: {
        themes(): ThemeButton[] {
            const themes = getThemeList()
            themes.unshift({
                id: 'default',
                colors: getArrayFormattedTheme('dark').map((theme) => theme.value),
            })
            return themes
        },
    },
    methods: {
        onThemeChanged(themeId: string) {
            this.activeTheme = themeId

            if (themeId === 'default') {
                this.updateColors(getArrayFormattedTheme('dark'))
            } else {
                const selectedTheme = predefinedThemes?.[themeId]
                selectedTheme && this.updateColors(selectedTheme)
            }
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
    flex-direction: row-reverse;
    gap: rem(4);
}

.buttons {
    opacity: 0;
    pointer-events: none;
    transition: 0.3s ease(out-quad) var(--theme-button-index, 0ms);
    transition-property: opacity, translate;
    translate: rem(20) 0;

    .root--open & {
        opacity: 1;
        pointer-events: initial;
        translate: 0 0;
    }
}
</style>
