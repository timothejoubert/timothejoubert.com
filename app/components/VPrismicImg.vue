<script lang="ts">
import { VImg } from '#components'
import type { ImageField, LinkField } from '@prismicio/client'
import { vImgProps } from '~/components/VImg.vue'
import { getImageFieldFilled } from '~/utils/prismic/image-field'
import { getFilledLinkToMedia } from '~/utils/prismic/link-field'

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
        const imgProps = computed(() => Object.fromEntries(Object.keys(vImgProps).map(key => [key, props[key as keyof typeof props]])))
        const imageField = computed(() => getImageFieldFilled(props.field))
        const mediaLinkField = computed(() => getFilledLinkToMedia(props.field))

        return () => h(VImg, {
            ...imgProps.value,
            src: imageField.value?.url || mediaLinkField.value?.url,
            width: props.width || imageField.value?.dimensions.width || mediaLinkField.value?.width || undefined,
            height: props.height || imageField.value?.dimensions.height || mediaLinkField.value?.height || undefined,
            alt: typeof props.alt === 'string' ? props.alt : (imageField.value?.alt || ''),
            provider: 'imgix',
            placeholder: props.placeholder || '#ffffff10',
            quality: 70,
        })
    },
})
</script>
