<script lang="ts" setup>
import type { ProjectDocument } from '~~/prismicio-types'
import type { VWrapperProps } from '../atoms/VWrapper.vue'

const props = defineProps<{
	project: ProjectDocument
} & VWrapperProps>()

const data = computed(() => props.project.data)
const tags = computed(() => {
	if (props.project.data.tag_group?.length) return props.project.data.tag_group.filter(item => item.tag).map(item => item.tag as string)
	return props.project.tags.filter(t => t) as string[]
})

const orderedTags = computed(() => {
	return [...tags.value]?.sort((a, b) => a.length - b.length)
})

const img = computed(() => data.value.thumbnail)
const imgSizes = computed(() => {
	return 'xs:92vw sm:92vw md:30vw lg:22vw xl:22vw hq:22vw qhd:22vw'
})
</script>

<template>
    <VWrapper
        :wrapper="wrapper"
        :class="$style.root"
    >
        <VPrismicLink
            v-if="data.title"
            :to="project"
            :class="$style.title"
        >
            {{ data.title }}
        </VPrismicLink>
        <div
            v-if="orderedTags && orderedTags.length"
            :class="$style.tags"
        >
            <VTag
                v-for="(tag, i) in orderedTags"
                :key="tag"
                :class="$style.tag"
                :label="tag"
                :style="{ '--tag-index': orderedTags.length - i }"
                wrapper="h3"
            />
        </div>
        <VPrismicImg
            v-if="img"
            :field="img"
            :width="400"
            :height="400"
            :sizes="imgSizes"
            :modifiers="{
                fit: 'crop',
                ar: 1,
            }"
            :class="$style.img"
        />
    </VWrapper>
</template>

<style lang="scss" module>
$card-padding: 16px;

.root {
    position: relative;
    display: flex;
    flex-direction: column;
    aspect-ratio: 1;
    border-radius: 0 42px 0 0;
    overflow: hidden;
    padding: $card-padding;
    isolation: isolate;

    &::before {
        position: absolute;
        z-index: 1;
        background: linear-gradient(20deg, rgba(0, 0, 0, 0.9) 10%, rgba(0, 0, 0, 0.15) 100%);
        content: '';
        inset: 0;
        opacity: 1;
        transition: opacity 0.4s ease(out-quad);
        pointer-events: none;
    }

    @media (hover: hover) {
        .root:hover &::before {
            opacity: 0.5;
        }
    }
}

.title {
    order: 2;
    color: var(--color-content);
    text-decoration: none;
    margin-top: 12px;
    z-index: 1;
    font-size: 16px;
    font-weight: 700;

    @at-root .root a#{&}::before {
        position: absolute;
        content: '';
        inset: 0;
    }
}

.tags {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 6px;
    order: 1;
    z-index: 1;
}

.tag {
    margin: initial;
    translate: calc(-100% - 20px) 0;
    transition: translate 0.3s calc(var(--tag-index) * 40ms) ease(out-quart);

    @media (hover: hover) {
        .root:hover & {
            translate: 0;
        }
    }
}

.img {
    position: absolute;
    inset: 0;
    z-index: -1;

    filter: grayscale(1);
    transition-duration: 0.3s;
    transition-property: filter, scale;
    transition-timing-function: ease(out-quart);

    @media (hover: hover) {
        .root:hover & {
            filter: grayscale(0);
            scale: 1.05;
        }
    }
}
</style>
