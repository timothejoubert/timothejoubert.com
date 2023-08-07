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
import { VCardProps } from '~/components/molecules/VCard.vue'

export default Vue.extend({
    name: 'VProjectCard',
    props: {
        project: { type: Object as PropType<ProjectDocument>, required: true },
    },
    data() {
        return {
            hovered: false,
        }
    },
    computed: {
        cardProps(): VCardProps {
            const { thumbnail, title, tags } = this.project.data

            const parsedTags = getTagsByReference(tags, this.$store.getters.projectTags)

            return {
                image: thumbnail,
                title: title || undefined,
                tags: parsedTags,
            }
        },
        isNew() {
            const projectDate = this.project.data.date

            if (!projectDate) return false

            const start = new Date()
            const end = new Date(projectDate)

            const MS_PER_DAY = 1000 * 60 * 60 * 24 // milliseconds, minutes, seconds, hours
            const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
            const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())

            const dayDiff = Math.abs(Math.floor((startUtc - endUtc) / MS_PER_DAY))
            return dayDiff < 90
        },
        activeProject() {
            return this.$store.state.currentPageData.uid
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
