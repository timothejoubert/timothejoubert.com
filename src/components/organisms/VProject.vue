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
        <div :class="$style.info">
            <div v-if="tags.length" :class="$style.tags">
                <v-button
                    v-for="tag in tags"
                    :key="tag"
                    :theme="isActiveTag(tag) ? 'accent' : 'light'"
                    :filled="true"
                    size="s"
                    :label="tag"
                    :class="$style.tag"
                    @click="onTagClick(tag)"
                />
            </div>
            <v-text v-if="project.content" :content="project.content" :class="$style.content" />
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
import IconClose from '~/assets/images/icons/close.svg?sprite'
import { getTagsByReference } from '~/utils/project/tag'
import MutationType from '~/constants/mutation-type'

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
        thumbnails(): LinkToMediaField[] {
            return [...Array(6).keys()].map(() => this.thumbnail)
        },
        tags(): string[] {
            return getTagsByReference(this.project.tags, this.$store.getters.projectTags)
        },
        filteredTags(): string[] {
            return this.$store.state.tagFilters
        },
    },
    methods: {
        onTagClick(tag: string) {
            if (this.isActiveTag(tag)) {
                // remove tag
                const tags = this.filteredTags.filter((filteredTag) => filteredTag !== tag)
                this.$store.commit(MutationType.TAG_FILTERS, tags)
            } else {
                // add tag
                this.$store.commit(MutationType.TAG_FILTERS, [...this.filteredTags, tag])
            }
        },
        isActiveTag(tag: string): boolean {
            return this.filteredTags.includes(tag)
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

.tags {
    display: flex;
    flex-wrap: wrap;
    gap: rem(12);
}

.content {
    margin-block: rem(20);
}

.thumbnail {
    width: 100%;
}
</style>
