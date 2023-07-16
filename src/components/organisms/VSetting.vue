<template>
    <div :class="$style.root" class="container">
        <v-setting-section title="Grille" :has-reset="false">
            <v-grid-settings />
        </v-setting-section>

        <v-setting-section :class="$style.color" title="Couleur" @onResetClicked="$refs.color.resetInterface()">
            <v-color-settings ref="color" />
        </v-setting-section>

        <v-setting-section title="Cadre" @onResetClicked="resetFramework">
            <v-scroll-overflow>
                <v-select
                    id="framework"
                    label="Types"
                    :active-values="currentFrameWork"
                    :options="frameworks"
                    @input="onFrameworkUpdate"
                />
            </v-scroll-overflow>
        </v-setting-section>

        <v-setting-section title="Domaine" @onResetClicked="resetTags">
            <v-scroll-overflow>
                <v-select
                    id="tag"
                    label="Domaines"
                    multiple
                    :active-values="currentTags"
                    :options="tags"
                    @input="onTagUpdate"
                />
            </v-scroll-overflow>
        </v-setting-section>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectFrameworkDocument, ProjectTagDocument } from '~~/prismicio-types'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VSetting',
    computed: {
        currentTags(): string[] {
            return this.$store.state.tagFilters
        },
        tags() {
            return this.$store.getters.projectTags.map((framework: ProjectTagDocument) => {
                return { value: framework.uid, label: framework.data.name }
            })
        },
        currentFrameWork(): string[] {
            return this.$store.state.frameWorkFilters
        },
        frameworks() {
            return this.$store.getters.projectFrameworks.map((framework: ProjectFrameworkDocument) => {
                return { value: framework.uid, label: framework.data.name }
            })
        },
    },
    methods: {
        onTagUpdate(value: string) {
            const indexValue = this.currentTags.findIndex((tag) => tag === value)
            const tags = this.currentTags.slice()
            const filteredTags = indexValue === -1 ? [...tags, value] : tags.filter((_tag, i) => i !== indexValue)

            this.$store.commit(MutationType.TAG_FILTERS, filteredTags)
        },
        resetTags() {
            this.$store.commit(MutationType.TAG_FILTERS, [])
        },
        onFrameworkUpdate(value: string) {
            this.$store.commit(MutationType.FRAMEWORK_FILTERS, [value])
        },
        resetFramework() {
            this.$store.commit(MutationType.FRAMEWORK_FILTERS, [])
        },
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

.color {
    display: none;

    @include media('>=lg') {
        display: block;
    }
}
</style>
