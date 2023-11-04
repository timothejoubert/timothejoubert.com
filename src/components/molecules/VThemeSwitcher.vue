<template>
    <div :class="[$style.root, isOpen && $style['root--open']]">
        <v-theme-colors
            :colors="['#EBEBEB', '#494949', '#AAAAAA']"
            aria-label="Ouvrir les différents themes"
            extended
            tag="button"
            :class="$style.toggle"
            @click.native="isOpen = !isOpen"
        />
        <!--            @focusin.native="isToggleFocus = true"-->
        <!--            @focusleave.native="isToggleFocus = false"-->
        <!--            @mouseleave.native="isToggleFocus = false"-->
        <!--            @mouseenter.native="isToggleFocus = true"-->
        <!--            @mouseleave.native="isToggleFocus = false"-->
        <div :class="$style.options" :inert="!isOpen">
            <!--            @mouseenter="isOptionsFocus = true"-->
            <!--            @mouseleave="isOptionsFocus = false"-->
            <div
                v-for="(theme, i) in themes"
                :key="theme.id"
                :class="$style.theme"
                :style="{ '--theme-button-index': (themes.length - i) * 50 + 'ms' }"
                @input="onThemeInput"
            >
                <v-theme-colors
                    :colors="theme.colors"
                    :is-selected="theme.id === activeTheme"
                    :extended="theme.id === activeTheme"
                    @click.native="activeTheme = theme.id"
                />
                <input
                    type="radio"
                    name="theme"
                    :value="theme.id"
                    :checked="theme.id === activeTheme"
                    :class="$style.input"
                    @focusin="activeTheme = theme.id"
                />
            </div>
        </div>
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
            isToggleFocus: false,
            isOptionsFocus: false,
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
    watch: {
        isToggleFocus() {
            this.isOpen = this.isToggleFocus || this.isOptionsFocus
        },
        isOptionsFocus() {
            this.isOpen = this.isToggleFocus || this.isOptionsFocus
        },
        activeTheme(themeId: string) {
            if (themeId === 'default') {
                this.updateColors(getArrayFormattedTheme('dark'))
            } else {
                const selectedTheme = predefinedThemes?.[themeId]
                selectedTheme && this.updateColors(selectedTheme)
            }
        },
    },
    methods: {
        onThemeInput(e: Event) {
            this.activeTheme = (e.target as HTMLInputElement)?.value || 'default'
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
    --v-theme-colors-width: #{rem(42)};
    --v-theme-switcher-padding: #{rem(4)};
    --v-theme-switcher-gap: #{rem(4)};

    display: flex;
    flex-direction: row-reverse;
    padding: var(--v-theme-switcher-padding);
    gap: var(--v-theme-switcher-gap);

    @include media('>=md') {
        align-items: center;
    }
}

.toggle {
    z-index: 2;
    cursor: pointer;
}

.options {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: row;
    padding: var(--v-theme-switcher-padding);
    gap: var(--v-theme-switcher-gap);

    &::after {
        position: relative;
        width: var(--v-theme-colors-width);
        aspect-ratio: 1;
        content: '';
    }

    &::before {
        position: absolute;
        top: 0;
        right: 0;
        width: calc(var(--v-theme-colors-width) + var(--v-theme-switcher-padding) * 2);
        height: 100%;
        background-color: color-mix(in sRGB, var(--theme-foreground-color) 5%, transparent);
        border-radius: rem(6);
        content: '';
        opacity: 0;
        pointer-events: none;
        transition: 0.4s ease(out-quad);
        transition-property: opacity, width, height;
    }

    @media (hover: hover) {
        .root:hover &::before {
            opacity: 1;
        }
    }

    .root--open &::before {
        width: 100%;
        height: 100%;
        opacity: 1;
    }

    @include media('<md') {
        flex-direction: column-reverse;
        padding-bottom: rem(8);

        &::before {
            width: 100%;
            height: calc(var(--v-theme-colors-width) + var(--v-theme-switcher-padding) * 2);
            border: 1px solid color-mix(in sRGB, var(--theme-foreground-color) 25%, transparent);
            background-color: var(--theme-background-color);
        }
    }
}

.theme {
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition: 0.2s ease(out-quad);
    transition-property: opacity, translate;
    translate: rem(20) 0;

    .root--open & {
        opacity: 1;
        pointer-events: initial;
        transition-delay: var(--theme-button-index, 0ms);
        transition-duration: 0.3s;
        translate: 0 0;
    }
}

.input {
    position: absolute;
    cursor: pointer;
    inset: 0;
    opacity: 0;
    pointer-events: none;
}
</style>
