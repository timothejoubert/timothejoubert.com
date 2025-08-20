<script lang="ts">
import pick from 'lodash/pick'
import type { ImageField, LinkField } from '@prismicio/types'
import { getImageFieldFilled } from '~/utils/prismic/image-field'
import { getFilledLinkToMedia } from '~/utils/prismic/link-field'
import { vImgProps } from '~/components/atoms/VImg.vue'
import { VImg } from '#components'

export type VPrismicImageField = LinkField | ImageField

export const vPrismicImgProps = {
	field: {
		type: Object as PropType<VPrismicImageField>,
		required: true,
	},
	...vImgProps,
}

export default defineComponent({
	props: {
		...vPrismicImgProps,
	},
	setup(props) {
		const imgProps = computed(() => pick(props, Object.keys(vImgProps)))
		const imageField = computed(() => getImageFieldFilled(props.field))
		const mediaLinkField = computed(() => getFilledLinkToMedia(props.field))

		return () => h(VImg, {
			...imgProps.value,
			src: imageField.value?.url || mediaLinkField.value?.url,
			width: props.width || imageField.value?.dimensions.width || mediaLinkField.value?.width,
			height: props.height || imageField.value?.dimensions.height || mediaLinkField.value?.height,
			alt: typeof props.alt === 'string' ? props.alt : (imageField.value?.alt || mediaLinkField.value?.name),
			provider: 'imgix',
			placeholder: props.placeholder || '#eee',
			quality: 70,
		})
	},
})
</script>
