<template>
    <div :class="$style.root" class="container">
        <v-setting-section title="Grille" :has-reset="false">
            <v-grid-settings />
        </v-setting-section>

        <v-setting-section title="couleur" @onResetClicked="$refs.color.resetInterface()">
            <v-color-settings ref="color" />
        </v-setting-section>

        <v-setting-section title="Cadre" @onResetClicked="resetFramework">
            <v-select id="framework" label="Types" />
        </v-setting-section>

        <v-setting-section title="Domaine" @onResetClicked="resetTags">
            <v-select id="tag" label="Domaines" />
        </v-setting-section>

        <v-setting-section title="Domaines" :has-reset="false">
            <v-select id="tag" label="Domaines" />
        </v-setting-section>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VSetting',
    computed: {
        isOpen() {
            return this.$store.state.isSettingsOpen
        },
    },
    methods: {
        onSliderChanged(value: string) {
            console.log('update slider val:', value)
        },
        resetFramework() {},
        resetTags() {},
    },
})
</script>
<style lang="scss" module>
.root {
    z-index: 2;
    display: flex;
    height: $v-settings-height;
    flex-wrap: wrap;
    padding-bottom: rem(8);
    border-bottom: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
    gap: rem(40);
}

.buttons {
    display: flex;
    flex-wrap: wrap;
    gap: rem(12);
}

.date {
    --v-setting-row-title-min-width: none;
}
</style>
