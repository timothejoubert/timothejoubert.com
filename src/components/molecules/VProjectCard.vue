<template>
    <v-link :reference="project" :class="$style.root" :inert="cardProps.isBlurred">
        <v-new-pill :date="project.data.date" :class="$style.new" :grow="hovered" />
        <v-card v-model="hovered" v-bind="cardProps" />
    </v-link>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { ProjectDocument } from '~~/prismicio-types'
import { VCardProps } from '~/components/molecules/VCard.vue'
import getTagsByProject from '~/utils/tags'

export default Vue.extend({
    name: 'VProjectCard',
    props: {
        project: { type: Object as PropType<ProjectDocument>, required: true },
        activeProjectsId: Array as PropType<string[]>,
    },
    data() {
        return {
            hovered: false,
        }
    },
    computed: {
        cardProps(): VCardProps {
            const { thumbnail, title } = this.project.data

            return {
                image: thumbnail,
                title: title || undefined,
                tags: getTagsByProject(this.project),
                selected: this.project?.uid === this.activeProject,
                activeTags: this.$store.state.tagFilters,
                isBlurred: this.activeProjectsId?.includes(this.project.uid),
            }
        },
        activeProject() {
            return this.$store.state.currentPageData?.uid
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
