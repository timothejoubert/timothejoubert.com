<template>
    <div
        :class="[$style.root, typeof layout === 'string' && $style[`root--layout-${layout}`]]"
        @mouseenter="isEnter = true"
        @mouseleave="isEnter = false"
    >
        <div :class="$style.media">
            <v-pill v-if="date" :class="$style.date" :label="date" filled theme="light" size="xs" />
            <v-image v-if="image" :prismic-image="image" :ratio="390 / 600" />
            <v-button filled :class="$style.cta">
                <template #icon>
                    <icon-arrow-up-right />
                </template>
            </v-button>
        </div>
        <div :class="$style.body">
            <div :class="$style.body__left">
                <v-split-word v-if="title" v-in-view.once :class="titleClass" :play-animation="isEnter" :word="title" />
                <div v-if="tags.length" v-in-view.once :class="$style.tags">
                    <span v-for="tag in tags" :key="'tag-' + tag.label" class="text-body-s" :class="$style.tag">{{
                        tag.label
                    }}</span>
                </div>
            </div>
            <v-text
                v-if="description"
                v-in-view.once
                :content="description"
                :class="$style.description"
                class="text-body-s"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import type { ImageField } from '@prismicio/types'
import * as prismicT from '@prismicio/types'
import IconArrowUpRight from '~/assets/images/icons/arrow-up-right.svg?sprite'

export type VCardLayout = 'centered' | null

export default Vue.extend({
    name: 'VCard',
    components: { IconArrowUpRight },
    props: {
        title: String,
        titleClass: { type: String, default: 'text-over-title-m' },
        image: Object as PropType<ImageField>,
        tags: {
            type: Array as PropType<String[]>,
            default: () => [],
        },
        date: String,
        description: [String, Array] as PropType<String | prismicT.RichTextField>,
        layout: String as PropType<VCardLayout>,
    },
    data() {
        return {
            isEnter: false,
        }
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
}

.media {
    --v-image-border-radius: #{rem(22)};

    position: relative;

    &::after {
        position: absolute;
        z-index: 1;
        background-image: linear-gradient(transparent, rgba(color(white), 0.15));
        content: '';
        inset: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }

    @media (hover: hover) {
        .root:hover &::after {
            opacity: 0;
        }
    }
}

.date {
    position: absolute;
    z-index: 2;
    top: rem(12);
    left: rem(12);
    display: var(--v-card-date-display, flex);
}

.cta {
    position: absolute;
    z-index: 2;
    right: rem(22);
    bottom: rem(22);
}

.body {
    display: flex;
    margin-top: rem(11);
}

.body__left {
    flex-grow: 1;

    .root--layout-centered & {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}

.tags {
    margin-top: rem(4);
    opacity: 0.8;
}

.tag {
    position: relative;

    &:not(:last-child)::after {
        position: relative;
        content: '|';
        margin-inline: rem(6);
    }
}

.description {
    display: var(--v-card-description-display);
    width: 100%;

    @include media('>=md') {
        width: clamp(#{rem(360)}, 25%, #{rem(480)});
    }
}
</style>
