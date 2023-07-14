<template>
    <div :class="$style.root" @mouseenter="mouseEnter = true" @mouseleave="mouseEnter = false">
        <v-image v-if="image" :prismic-image="image" :class="$style.image" :cover="true" />

        <div :class="$style.body">
            <template v-if="tags.length">
                <transition-group :name="$style['tag-animation']" tag="div" :class="$style.tags">
                    <v-button
                        v-for="(tag, i) in tagList"
                        :key="tag"
                        theme="dark"
                        tag="div"
                        :filled="true"
                        :style="{ '--tag-index': tagList.length - i }"
                        size="xs"
                        :label="tag"
                        :class="$style.tag"
                    />
                </transition-group>
            </template>
            <v-slide-text
                v-if="title"
                :play-animation="mouseEnter"
                class="text-over-title-m"
                :content="title"
                :class="$style.title"
            />
            <span v-if="date" class="text-over-title-xs">{{ date }}</span>
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
    computed: {
        tagList() {
            return this.mouseEnter ? this.tags.sort((a, b) => a.length - b.length) : []
        },
    },
    watch: {
        mouseEnter(value: boolean) {
            this.$emit('input', value)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    overflow: hidden;
    align-items: flex-end;
    padding: 4%;
    aspect-ratio: 1;
    border-radius: 0 #{rem(48)} 0 0;
}

.image {
    filter: grayscale(1);
    transition-duration: 0.4s;
    transition-property: filter, scale;
    transition-timing-function: ease(out-quad);

    &::after {
        position: absolute;
        z-index: 1;
        background: linear-gradient(45deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.15) 100%);
        content: '';
        inset: 0;
        opacity: 1;
        transition: opacity 0.4s ease(out-quad);
    }

    @media (hover: hover) {
        .root:hover & {
            filter: grayscale(0);
            scale: 1.05;
        }

        .root:hover &::after {
            opacity: 0.5;
        }
    }
}

.title {
    display: inline-flex;
    color: var(--theme-accent-color);
}

.body {
    position: relative;
    z-index: 1;
}

.tags {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: rem(14);
    gap: rem(10);
}

.tag {
    position: relative;
    white-space: nowrap;
}

.tag-animation {
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition-delay: calc(var(--tag-index) * 30ms);
        transition-duration: 0.4s;
        transition-property: opacity, translate;
        transition-timing-function: ease(out-quad);
    }

    &:global(#{'-enter'}),
    &:global(#{'-leave-to'}) {
        opacity: 0;
        translate: -100% 0;
    }
}
</style>
