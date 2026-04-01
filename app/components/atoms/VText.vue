<script lang="ts" setup>
import type { KeyTextField, RichTextField } from '@prismicio/client'
import type { VueRichTextSerializer } from '@prismicio/vue'
// import { RichTextNodeType } from '@prismicio/client'

export type VTextContent = string | RichTextField | KeyTextField | null

interface VTextProps {
	tag?: string
	content?: VTextContent
	richTextSerializer?: VueRichTextSerializer | null
}

const prismic = usePrismic()
// Use custom rendered component
// https://prismic.io/docs/fields/rich-text
const props = withDefaults(defineProps<VTextProps>(), {
	richTextSerializer: {
		hyperlink: undefined,
	},
})

const slots = useSlots()
const hasSlot = slots.default?.()

const isString = computed(() => typeof props.content === 'string')

const richTextFilled = computed(() => {
	const isRichText = props.content && typeof props.content !== 'string'
	if (isRichText && prismic.isFilled.richText(props.content)) return props.content

	return undefined
})

const flatRichTextContent = computed(() => {
	if (richTextFilled.value?.length === 1 && !richTextFilled.value[0]?.spans.length) {
		return (richTextFilled.value?.[0] as { text: string })?.text
	}

	return undefined
})
</script>

<template>
    <component
        :is="tag || 'p'"
        v-if="isString || hasSlot || flatRichTextContent"
        :class="$style.root"
    >
        <slot>{{ flatRichTextContent ? flatRichTextContent : content }}</slot>
    </component>
    <PrismicRichText
        v-else-if="!!richTextFilled?.length"
        :class="[$style.root, $attrs.class]"
        :field="richTextFilled"
        wrapper="div"
        :components="richTextSerializer || undefined"
    />
</template>

<style lang="scss" module>
.root {
    *:first-child {
        margin-top: initial;
    }

    strong {
        font-weight: bold;
    }

    a {
        color: var(--theme-color-primary);

        // text-decoration: underline;
        // text-decoration-thickness: 0.5px;
        // text-underline-offset: 2px;
    }
}
</style>
