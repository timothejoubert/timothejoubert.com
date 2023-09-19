<template>
    <div :class="rootClasses" @mouseenter="mouseEnter = true" @mouseleave="mouseEnter = false">
        <v-image
            v-if="image"
            :prismic-image="image"
            :class="$style.image"
            :cover="true"
            :ratio="1"
            :sizes="maxCardPercentDisplayed"
        />

        <div :class="$style.body">
            <template v-if="tags && tags.length">
                <transition-group :name="$style['tag-animation']" tag="div" :class="$style.tags">
                    <v-button
                        v-for="(tag, i) in tagList"
                        :key="tag.id"
                        :theme="activeTags && activeTags.includes(tag.id) ? 'accent' : 'dark'"
                        tag="div"
                        :filled="true"
                        :style="{ '--tag-index': tagList.length - i }"
                        size="xs"
                        :label="tag.label"
                        :class="$style.tag"
                    />
                </transition-group>
            </template>
            <h3 v-if="title" :class="[$style.title, isProjectOpen ? 'text-over-title-xs' : 'text-over-title-m']">
                {{ title }}
            </h3>
            <span v-if="date" class="text-over-title-xs">{{ date }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { PrismicMedia } from '~/types/prismic/app-prismic'
import { Tag } from '~/utils/tags'
import AppConst from '~/constants/app'
import { mediaIsMax } from '~/utils/media'

export interface VCardProps {
    title?: string
    image?: PrismicMedia
    tags?: Tag[]
    date?: string
    selected?: boolean
    activeTags?: Tag[]
    isBlurred?: boolean
}

export default Vue.extend({
    name: 'VCard',
    props: {
        title: String,
        image: Object as PropType<PrismicMedia>,
        tags: {
            type: Array as PropType<Tag[]>,
            default: () => [],
        },
        date: String,
        selected: Boolean,
        isBlurred: Boolean,
        activeTags: { type: Array as PropType<string[]>, default: () => [] },
    },
    data() {
        return {
            mouseEnter: false,
            maxCardPercentDisplayed: 100 / parseInt(AppConst.UI_COLUMNS) || 25,
        }
    },
    computed: {
        rootClasses(): (string | undefined | false)[] {
            return [
                this.$style.root,
                this.isBlurred && this.$style['root--blurred'],
                this.mouseEnter && this.$style['root--mouse-enter'],
                this.selected && this.$style['root--selected'],
            ]
        },
        isProjectOpen(): boolean {
            return !!this.$store.getters.isProjectOpen
        },
        sortedTags(): Tag[] {
            return this.tags?.slice().sort((tag1, tag2) => tag1.label.length - tag2.label.length) || []
        },
        tagList(): Tag[] {
            const isHidden = this.mouseEnter || !!this.$store.getters.isProjectOpen
            return isHidden ? [] : this.sortedTags
        },
    },
    watch: {
        mouseEnter(value: boolean) {
            this.$emit('input', value)
        },
        '$store.state.uiColumns'(value: string) {
            this.maxCardPercentDisplayed = Math.ceil(Math.max(this.maxCardPercentDisplayed, 100 / parseInt(value)))
        },
    },
    mounted() {
        if (mediaIsMax('md')) this.maxCardPercentDisplayed = 50
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
    border-radius: $v-card-border-radius;
    /* stylelint-disable property-no-unknown */
    container-name: card;
    container-type: inline-size;
    /* stylelint-enable */
    transition: 0.2s ease(out-quad);

    &::after {
        position: absolute;
        z-index: 5;
        border: 1px solid transparent;
        border-radius: $v-card-border-radius;
        content: '';
        inset: 0;
        pointer-events: none;
        transition: border-color 0.3s;
    }

    &--selected::after {
        border-color: var(--theme-accent-color);
    }

    &--blurred {
        filter: blur(1px);
        opacity: 0.3;
    }
}

.image {
    filter: grayscale(1);
    transition-duration: 0.4s;
    transition-property: filter, scale, filter;
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
    font-weight: 800;
    transition: 0.4s ease(out-quad);
    transition-property: translate, font-size;

    .root--blurred & {
        color: var(--theme-foreground-color);
    }

    .root--mouse-enter & {
        translate: calc(-100% - 20px) 0;
    }
}

.body {
    position: relative;
    z-index: 1;
}

/* stylelint-disable-next-line scss/at-rule-no-unknown */
@container card (max-width: 200px) {
    .tags {
        display: none !important;
    }
}

.tags {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: rem(10);
    gap: rem(6);
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
