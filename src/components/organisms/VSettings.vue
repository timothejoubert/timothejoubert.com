<template>
    <div :class="$style.root" class="container">
        <div :class="$style.column">
            <div :class="$style.head">
                <span :class="$style.title" class="text-over-title-m">interface</span>
                <button :class="$style.reset" @click="resetInterface">Reset</button>
            </div>
            <div :class="$style.body">
                <div :class="$style.row">
                    <div :class="$style.row__title">Couleurs</div>
                    <div :class="$style.buttons">
                        <v-color-input id="foreground" label="Principale" />
                        <v-color-input id="accent" label="Accent" />
                        <v-color-input id="background" label="Background" />
                        <v-select
                            id="predefines-theme"
                            label="Theme prédéfinis"
                            :options="clientThemes"
                            @input="onThemeChanged"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style.column"></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'
import { getArrayFormattedTheme, getPredefinedThemes } from '~/utils/get-theme'

const predefinedThemes = getPredefinedThemes()

export default Vue.extend({
    name: 'VSettings',
    computed: {
        isOpen() {
            return this.$store.state.isSettingsOpen
        },
        clientThemes() {
            return Object.keys(predefinedThemes).map((key) => ({ value: key, label: key.split('-').join(' ') }))
        },
    },
    methods: {
        resetInterface() {
            this.updateColors(getArrayFormattedTheme())
        },
        onThemeChanged(themeId: string) {
            const selectedTheme = predefinedThemes?.[themeId]
            selectedTheme && this.updateColors(selectedTheme)
        },
        updateColors(colors: { key: string; value: string }[]) {
            colors.forEach((color) => {
                this.$store.commit(MutationType.CLIENT_THEME, { key: color.key, value: color.value })
            })
        },
    },
})
</script>
<style lang="scss" module>
.root {
    z-index: 2;
    display: flex;
    height: $v-settings-height;
    padding: rem(26) rem(8);
    border-bottom: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
}

.head {
    margin-bottom: rem(30);
}

.column {
    width: 50%;
}

.title {
    margin-right: rem(18);
}

.reset {
    padding: rem(3) rem(16);
    background-color: var(--theme-accent-color);
    color: var(--theme-background-color);
    font-size: rem(13);
    font-weight: 500;
}

.row {
    display: flex;
    align-items: center;
}

.row__title {
    min-width: rem(120);
    font-size: rem(14);
    opacity: 0.6;
}

.buttons {
    display: flex;
    gap: rem(12);
}
</style>
