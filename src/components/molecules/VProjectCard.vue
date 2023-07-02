<template>
    <v-link :reference="project">
        <v-card v-bind="cardProps" />
    </v-link>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { getProjectYear } from '~/utils/prismic/date'
import { ProjectDocument, ProjectTagDocument } from '~~/prismicio-types'

export default Vue.extend({
    name: 'VProjectCard',
    props: {
        project: Object as PropType<ProjectDocument>,
    },
    computed: {
        cardProps(): Record<string, any> {
            const { thumbnail, title, date, tags } = this.project.data

            const parsedTags = tags.map((tagReference) => {
                const uid = (tagReference.tag as { uid?: string })?.uid
                return this.$store.state.projectTags.filter(
                    (projectTag: ProjectTagDocument) => projectTag.uid === uid
                )?.[0]?.data?.name
            })

            console.log(parsedTags)

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
