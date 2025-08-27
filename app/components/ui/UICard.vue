<script lang="ts" setup>
import type { VPrismicImageField } from '~/components/atoms/VPrismicImg.vue'
import type { VWrapperProps } from '~/components/atoms/VWrapper.vue'
import VPrismicLink from '../atoms/VPrismicLink.vue'

const props = defineProps<{
	title: string | null
	image: VPrismicImageField
	content: string | null
	tags?: string[]
	url?: string | null
} & VWrapperProps>()

const imgSizes = computed(() => {
	return 'xs:92vw sm:92vw md:30vw lg:22vw xl:22vw hq:22vw qhd:22vw'
})

const $style = useCssModule()
const rootClasses = computed(() => {
	return [
		props.url && $style['root--has-link'],
		$style.root,
	]
})
</script>

<template>
    <VWrapper
        :wrapper="wrapper"
        :class="rootClasses"
    >
        <component
            :is="url ? VPrismicLink : 'h3'"
            v-if="title"
            :to="url"
            :class="[$style.title]"
        >
            {{ title }}
        </component>
        <div
            v-if="tags && tags.length"
            :class="$style.tags"
        >
            <VTag
                v-for="tag in tags"
                :key="tag"
                :class="$style.tag"
                :label="tag"
                wrapper="h3"
            />
        </div>
        <span
            v-if="content"
            :class="$style.content"
        >{{ content }}</span>
        <VPrismicImg
            v-if="image"
            :field="image"
            :width="400"
            :height="400"
            :sizes="imgSizes"
            :modifiers="{
                fit: 'crop',
                ar: 1,
            }"
            :class="$style.image"
        />
    </VWrapper>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    flex-direction: column;
}

.title {
    order: 2;
    color: var(--color-content);
    margin-block: 10px;

    @at-root .root a#{&}::before {
        position: absolute;
        content: '';
        inset: 0;
    }
}

.tags {
    display: flex;
    flex-wrap: wrap;
    order: 3;
    gap: 6px;
}

.tag {
    margin-block: initial;
}

.content {
    order: 4;
    margin-top: 10px;
}

.image {
    order: 1;
}
</style>
