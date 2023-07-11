<template>
    <div :class="$style.root" class="container">
        <div :class="$style.header">
            <div :class="$style.title" class="text-h2">{{ project.title }}</div>
            <v-button href="/">
                <template #icon>
                    <icon-close />
                </template>
            </v-button>
        </div>

        <v-project-parsed v-slot="projectContent" :project="project">
            <v-project-specification v-bind="projectContent" />
        </v-project-parsed>

        <div :class="$style.medias">
            <v-image v-for="(media, i) in medias" :key="i" :prismic-image="media" :class="$style.media" />
            <!--            <v-image v-if="thumbnail" :prismic-image="thumbnail" :class="$style.thumbnail" />-->
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { LinkToMediaField } from '@prismicio/types/src/value/linkToMedia'
import { ProjectDocumentData } from '~~/prismicio-types'
import IconClose from '~/assets/images/icons/close.svg?sprite'

export default Vue.extend({
    name: 'VProject',
    components: { IconClose },
    computed: {
        project(): ProjectDocumentData {
            return this.$store.state.currentPageData.data
        },
        thumbnail(): LinkToMediaField {
            return this.project.thumbnail
        },
        medias(): LinkToMediaField[] {
            return [...Array(6).keys()].map(() => this.thumbnail)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
}

.header {
    display: flex;
    min-height: $v-top-bar-height;
    align-items: center;
    justify-content: space-between;
}

.medias {
    margin-block: rem(50) $container-padding-inline;
}

.media {
    width: 100%;
    margin-block: $container-padding-inline;
}
</style>
