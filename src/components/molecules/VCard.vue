<template>
    <div :class="$style.root" @mouseenter="mouseEnter = true" @mouseleave="mouseEnter = false">
        <v-image v-if="image" :prismic-image="image" :class="$style.image" :cover="true" />

        <div :class="$style.body">
            <v-split-word
                v-if="title"
                class="text-over-title-m"
                :word="title"
                :play-animation="mouseEnter"
                :class="$style.title"
            />
            <span v-if="date" class="text-over-title-xs">{{ date }}</span>
            <div v-if="tags.length" :class="$style.tags">
                <v-button
                    v-for="tag in tags"
                    :key="tag"
                    theme="light"
                    tag="div"
                    :filled="true"
                    size="xs"
                    :label="tag"
                    :class="$style.tag"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import type { ImageField } from '@prismicio/types'

export default Vue.extend({
    name: 'VCard',
    props: {
        title: String,
        image: Object as PropType<ImageField>,
        tags: {
            type: Array as PropType<String[]>,
            default: () => [],
        },
        date: String,
    },
    data() {
        return {
            mouseEnter: false,
        }
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    overflow: hidden;
    align-items: flex-end;
    padding: rem(12) rem(18);
    aspect-ratio: 1;
    border-radius: 0 #{rem(48)} 0 0;
}

.image {
    filter: grayscale(1);
    transition: filter 0.3s ease(out-quad);

    &::after {
        position: absolute;
        z-index: 1;
        background: linear-gradient(45deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.15) 100%);
        content: '';
        inset: 0;
        opacity: 1;
        transition: opacity 0.5s ease(out-quad);
    }

    @media (hover: hover) {
        .root:hover & {
            filter: grayscale(0);
        }
    }
}

.title {
    display: inline-flex;
    color: color(accent);
}

//.date {
//}

.body {
    position: relative;
    z-index: 1;
}

.tags {
    display: flex;
    overflow: hidden;
    margin-top: rem(4);
    gap: rem(10);
}

.tag {
    position: relative;
    white-space: nowrap;
}
</style>
