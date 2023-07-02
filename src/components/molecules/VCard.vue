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
            <span v-if="date">{{ date }}</span>
            <div v-if="tags.length" :class="$style.tags">
                <v-button theme="light" :filled="true" size="xs" v-for="tag in tags" :key="tag" class="text-body-s" :label="tag" :class="$style.tag" />
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
    data() {
        return {
            mouseEnter: false,
        }
    },
    props: {
        title: String,
        image: Object as PropType<ImageField>,
        tags: {
            type: Array as PropType<String[]>,
            default: () => [],
        },
        date: String,
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

.date {
}

.body {
    position: relative;
    z-index: 1;
}

.tags {
    display: flex;
    overflow: hidden;
    gap: rem(10);
    margin-top: rem(4);
}

.tag {
    position: relative;
    white-space: nowrap;
}
</style>
