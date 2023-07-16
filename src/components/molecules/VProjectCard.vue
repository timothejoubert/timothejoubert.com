<template>
    <v-link :reference="project" :class="$style.root">
        <v-new-pill v-if="isNew" :class="$style.new" :grow="hovered" />
        <v-card v-model="hovered" v-bind="cardProps" :selected="project?.uid === activeProject" />
    </v-link>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { ProjectDocument } from '~~/prismicio-types'
import { getTagsByReference } from '~/utils/project/tag'

export default Vue.extend({
    name: 'VProjectCard',
    props: {
        project: Object as PropType<ProjectDocument>,
    },
    data() {
        return {
            hovered: false,
        }
    },
    computed: {
        cardProps(): Record<string, any> {
            const { thumbnail, title, tags } = this.project.data

            const parsedTags = getTagsByReference(tags, this.$store.getters.projectTags)

            return {
                image: thumbnail,
                title,
                tags: parsedTags,
            }
        },
        isNew() {
            const projectDate = this.project.data.date
            return !!projectDate && this.dateDiffInDays(new Date(), new Date(projectDate)) < 90
        },
        activeProject() {
            return this.$store.state.currentPageData.uid
        },
    },
    methods: {
        dateDiffInDays(a: Date, b: Date): number {
            const MS_PER_DAY = 1000 * 60 * 60 * 24 // milliseconds, minutes, seconds, hours
            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

            return Math.abs(Math.floor((utc1 - utc2) / MS_PER_DAY))
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
}

.new {
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
}
</style>
