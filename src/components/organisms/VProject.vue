<template>
    <div :class="$style.root" class="container">
        <div :class="$style.header">
            <div :class="$style.title" class="text-h2">{{ project.title }}</div>
        </div>
        <div :class="$style.body">
            <v-image v-for="img in thumbnails" :prismic-image="img" :class="$style.thumbnail" />
            <!--            <v-image v-if="thumbnail" :prismic-image="thumbnail" :class="$style.thumbnail" />-->
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { LinkToMediaField } from '@prismicio/types/src/value/linkToMedia'
import { ProjectDocumentData } from '~~/prismicio-types'

export default Vue.extend({
    name: 'VProject',
    computed: {
        project(): ProjectDocumentData {
            return this.$store.state.currentPageData.data
        },
        thumbnail(): LinkToMediaField {
            return this.project.thumbnail
        },
        thumbnails(): LinkToMediaField[] {
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
    height: $v-top-bar-height;
    align-items: center;
}

.thumbnail {
    width: 100%;
}
</style>
