<template>
    <div>
        <v-select
            id="theme"
            :options="clientThemes"
            :active-values="activeTheme"
            :multiple="false"
            :class="$style.checkboxes"
            @input="onThemeChanged"
        />
        <v-color-input id="foreground" :class="$style.color" />
        <v-color-input id="accent" :class="$style.color" />
        <v-color-input id="background" :class="$style.color" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getArrayFormattedTheme, getPredefinedThemes } from '~/utils/get-theme'
import MutationType from '~/constants/mutation-type'

const predefinedThemes = getPredefinedThemes()

export default Vue.extend({
    name: 'VColorSettings',
    data() {
        return {
            activeTheme: [],
        }
    },
    computed: {
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
.checkboxes {
    margin-bottom: rem(20);
}

.color {
    &:not(:last-child) {
        margin-right: rem(8);
    }
}
</style>
