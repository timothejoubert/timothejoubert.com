<template>
    <v-link :reference="project">
        <v-card v-bind="cardProps" />
    </v-link>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { getProjectYear } from '~/utils/prismic/date'
import { ProjectDocument } from '~~/prismicio-types'
import { getTagsByReference } from '~/utils/project/tag'

export default Vue.extend({
    name: 'VProjectCard',
    props: {
        project: Object as PropType<ProjectDocument>,
    },
    computed: {
        cardProps(): Record<string, any> {
            const { thumbnail, title, date, tags } = this.project.data

            const parsedTags = getTagsByReference(tags, this.$store.getters.projectTags)

            return {
                image: thumbnail,
                title,
                tags: parsedTags,
                date: getProjectYear(date),
            }
        },
    },
})
</script>
