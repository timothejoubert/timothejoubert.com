<script  lang="ts" setup>
import type { ProjectDocument } from '~/prismicio-types'

interface VProjectCardProps {
    project: ProjectDocument | null
}

const props = defineProps<VProjectCardProps>()

const data = computed(() => props.project?.data)
const thumbnail = computed(() => data.value?.thumbnail)
const title = computed(() => data.value?.title)
</script>

<template>
    <VPrismicLink
        :to="props.project"
        :class="$style.root"
    >
        <VPrismicImage
            v-if="thumbnail"
            :document="thumbnail"
            fit="crop"
            ar="1:1"
            width="500"
            height="500"
            :class="$style.image"
            sizes="sm:100vw md:50vw lg:25vw xl:25vw xxl:25vw hq:25vw qhd:25vw"
        />
        <div
            v-else
            :class="[$style.image, $style['image--placeholder']]"
        />
        <div :class="$style.body">
            <div :class="$style.title">
                {{ title }}
            </div>
        </div>
    </VPrismicLink>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: block;
    border-radius: rem(8);
    overflow: hidden;
    color: white;

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
        &::after:hover {
            opacity: 0.5;
        }
    }
}

.image {
    filter: grayscale(1);
    transition-duration: 0.4s;
    transition-property: filter, scale;
    transition-timing-function: ease(out-quad);

    @media (hover: hover) {
        .root:hover & {
            filter: grayscale(0);
            scale: 1.03;
        }
    }
}

.body {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: absolute;
    inset: 0;
    padding: rem(14);
    z-index: 2;
}

.title {
    font-weight: 800;
}
</style>
