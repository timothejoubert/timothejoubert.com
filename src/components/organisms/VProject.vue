<template>
    <div :class="$style.root" class="container">
        <nuxt-link
            to="/"
            :class="$style.header"
            @mouseenter.native="mouseEnter = true"
            @mouseleave.native="mouseEnter = false"
        >
            <v-slide-text
                :play-animation="mouseEnter"
                class="text-h2"
                :class="$style.title"
                :content="project.title ? project.title : undefined"
            />
            <icon-close :class="$style['close-icon']" />
        </nuxt-link>

        <v-project-parsed v-slot="projectContent" :project="project">
            <v-project-specification v-bind="projectContent" />
        </v-project-parsed>

        <div :class="$style.medias">
            <div v-for="(media, i) in medias" :key="i" :class="$style.media">
                <v-image :prismic-image="media" :sizes="55" />
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { LinkToMediaField } from '@prismicio/types/src/value/linkToMedia'
import { ProjectDocumentData, ProjectDocumentDataMediasItem } from '~~/prismicio-types'
import IconClose from '~/assets/images/icons/close.svg?sprite'

export default Vue.extend({
    name: 'VProject',
    components: { IconClose },
    data() {
        return {
            mouseEnter: false,
        }
    },
    computed: {
        project(): ProjectDocumentData {
            return this.$store.state.currentPageData.data
        },
        medias(): LinkToMediaField[] {
            const medias =
                this.project.medias?.map((mediaReference: ProjectDocumentDataMediasItem) => mediaReference.media) || []
            return [...medias, this.project.thumbnail]
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
}

.header {
    position: sticky;
    z-index: 10;
    top: 0;
    display: flex;
    min-height: $v-top-bar-height;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
}

.title {
    display: inline-flex;
    //color: var(--theme-accent-color);
}

.close-icon {
    transform-origin: center;
    transition: none;

    @media (hover: hover) {
        .header:hover & {
            rotate: 180deg;
            transition: rotate 0.7s ease(out-quad);
        }
    }
}

.medias {
    margin-bottom: rem(50);
}

.media {
    --v-image-border-radius: #{rem(8)};

    width: 100%;
    margin-block: $container-padding-inline;

    &:not(:last-child) {
        overflow: hidden;
        padding: rem(20) rem(20);
        background-color: #efeeee;

        img {
            box-shadow: 5px 5px 8px rgba(#000, 0.07), -5px -5px 8px rgba(#000, 0.04);
        }
    }
}
</style>
