<template>
    <div :class="$style.root" class="container">
        <div :class="$style.tags">
            <v-button
                :animate="!!selectedTags.length"
                size="s"
                label="Reset"
                theme="light"
                :class="[$style.reset, !!selectedTags.length && $style['reset--enabled']]"
                @click="resetTags"
            />
            <v-button
                v-for="tag in filteredTags"
                :key="tag.id"
                :theme="selectedTags.includes(tag.id) ? 'accent' : 'dark'"
                size="s"
                filled
                :label="tag.label"
                animate
                @click="onTagClicked(tag.id)"
            />
        </div>
        <v-column-input :class="$style.columns" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'
import AppConst from '~/constants/app'
import toBoolean from '~/utils/to-boolean'
import { ProjectDocument } from '~~/prismicio-types'
import getTagsByProject, { Tag } from '~/utils/tags'

export default Vue.extend({
    name: 'VFavoriteSetting',
    computed: {
        filteredTags(): Tag[] {
            const isEveryProjectDisplayed = this.$store.state.isEveryProjectInFavorite
            const projects = this.$store.getters[isEveryProjectDisplayed ? 'projects' : 'highlightedProjects']

            return projects.reduce((accumulator: Tag[], project: ProjectDocument) => {
                const projectTags = getTagsByProject(project)

                projectTags.forEach((projectTag) => {
                    const hasSameTag = accumulator.some((addedTag) => addedTag.id === projectTag.id)
                    if (!hasSameTag) accumulator.push(projectTag)
                })

                return accumulator
            }, [])
        },
        selectedTags(): string[] {
            return this.$store.state.tagFilters
        },
        enableOneTag(): boolean {
            return toBoolean(AppConst.ONLY_ONE_TAG_ALLOW)
        },
    },
    mounted() {
        window.addEventListener('keyup', this.onKeyUp)
    },
    methods: {
        onKeyUp(e: KeyboardEvent) {
            if (e.key === 'Backspace' || e.key === 'Escape') this.resetTags()
        },
        onTagClicked(value: string) {
            const tags = this.selectedTags.slice()
            const tagIndex = this.selectedTags.indexOf(value)

            if (this.enableOneTag && tagIndex === -1) {
                tags.length = 0
                tags.push(value)
            } else if (tagIndex === -1) tags.push(value)
            else tags.splice(tagIndex, 1)

            this.$store.commit(MutationType.TAG_FILTERS, tags)
        },
        resetTags() {
            this.$store.commit(MutationType.TAG_FILTERS, [])
        },
    },
})
</script>
<style lang="scss" module="">
.root {
    display: flex;
    justify-content: space-between;
    gap: rem(40);
    margin-block: rem(20) rem(26);
}

.tags {
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: rem(8);
}

.reset {
    --v-button-min-width: 0;
    --v-button-padding: 0;

    margin-right: rem(10);
    opacity: 0.5;

    &--enabled {
        opacity: 1;
        text-decoration: underline;
        text-underline-offset: 2px;
    }
}

.columns {
    display: none;

    @include media('>=lg') {
        display: block;
    }
}
</style>
