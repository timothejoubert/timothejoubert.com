<template>
    <div :class="$style.root" class="container">
        <v-setting-section title="Interface" :has-reset="false">
            <v-grid-settings />
        </v-setting-section>

        <v-setting-section
            :has-content-filled="isColorFilled"
            :class="$style.color"
            title="Couleur"
            @onResetClicked="$refs.color.resetInterface()"
        >
            <v-color-settings ref="color" />
        </v-setting-section>

        <v-setting-section title="Cadre" :has-content-filled="isFrameworkFilled" @onResetClicked="resetFramework">
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

        <v-setting-section title="Domaine" :has-content-filled="isTagFilled" @onResetClicked="resetTags">
            <v-scroll-overflow>
                <v-select
                    id="tag"
                    label="Domaines"
                    type="multiple"
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
import { getObjectFormattedTheme } from '~/utils/get-theme'
import { VSelectOption } from '~/components/atoms/VSelect.vue'

export default Vue.extend({
    name: 'VSetting',
    computed: {
        currentTags(): string[] {
            return this.$store.state.tagFilters
        },
        tags(): VSelectOption[] {
            return this.$store.getters.projectTags.map((framework: ProjectTagDocument) => {
                return { value: framework.uid, label: framework.data.name }
            })
        },
        currentFrameWork(): string[] {
            return this.$store.state.frameWorkFilters
        },
        frameworks(): VSelectOption[] {
            return this.$store.getters.projectFrameworks.map((framework: ProjectFrameworkDocument) => {
                return { value: framework.uid, label: framework.data.name }
            })
        },
        isFrameworkFilled() {
            return !!this.$store.state.frameWorkFilters?.length
        },
        isTagFilled() {
            return !!this.$store.state.tagFilters?.length
        },
        isColorFilled() {
            const defaultTheme = Object.values(getObjectFormattedTheme())
            const currentThemeColor = Object.values(this.$store.state.uiTheme)
            return !defaultTheme.every((color, i) => color === currentThemeColor[i])
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
    --scroll-section-max-height: #{rem(160)};

    z-index: 2;
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    //height: $v-settings-height;
    padding-bottom: rem(32);
    border-bottom: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
    gap: rem(40);
}

//.color {
//    display: none;
//
//    @include media('>=lg') {
//        display: block;
//    }
//}
</style>
