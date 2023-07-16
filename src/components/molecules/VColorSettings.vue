<template>
    <div :class="$style.root">
        <v-scroll-overflow :class="$style.checkboxes">
            <v-select
                id="theme"
                :options="clientThemes"
                :active-values="activeTheme"
                :multiple="false"
                @input="onThemeChanged"
            />
        </v-scroll-overflow>

        <div :class="$style.colors">
            <v-color-input id="foreground" :class="$style.color" />
            <v-color-input id="accent" :class="$style.color" />
            <v-color-input id="background" :class="$style.color" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getArrayFormattedTheme, getObjectFormattedTheme, getPredefinedThemes } from '~/utils/get-theme'
import MutationType from '~/constants/mutation-type'

const predefinedThemes = getPredefinedThemes()

export default Vue.extend({
    name: 'VColorSettings',
    data() {
        return {
            activeTheme: [] as string[],
        }
    },
    computed: {
        clientThemes() {
            return Object.keys(predefinedThemes).map((key) => ({ value: key, label: key.split('-').join(' ') }))
        },
    },
    methods: {
        resetInterface() {
            this.activeTheme = []
            this.updateColors(getArrayFormattedTheme())
            this.$store.commit(MutationType.UI_THEME, getObjectFormattedTheme())
        },
        onThemeChanged(themeId: string) {
            this.activeTheme = [themeId]
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
    gap: rem(20);
}
.checkboxes {
    margin-bottom: rem(20);
}

.colors {
    display: flex;
    flex-direction: column;
    margin-left: rem(30);
    gap: rem(8);
}
</style>
