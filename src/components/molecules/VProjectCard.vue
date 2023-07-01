<template>
    <v-link :reference="project">
        <v-card v-bind="cardProps" />
    </v-link>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { VCardLayout } from '~/components/molecules/VCard.vue'
import { getProjectYear } from '~/utils/prismic/date'
import { ProjectDocument } from '~~/prismicio-types'

export default Vue.extend({
    name: 'VProjectCard',
    props: {
        project: Object as PropType<ProjectDocument>,
        layout: String as PropType<VCardLayout>,
        titleClass: String,
    },
    computed: {
        cardProps(): Record<string, any> {
            const { thumbnail, title, tags, date, content } = this.project.data

            return {
                image: thumbnail,
                title,
                titleClass: this.titleClass,
                description: content,
                tags,
                date: getProjectYear(date),
                layout: this.layout,
            }
        },
    },
})
</script>
