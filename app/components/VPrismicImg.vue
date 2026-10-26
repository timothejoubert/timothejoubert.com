<script lang="ts">
import { VImg } from '#components'
import type { ImageField, LinkField } from '@prismicio/client'
import { getQuery } from 'ufo'
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

        // Prismic URLs already carry imgix params (`?auto=compress,format`, crop `rect`...).
        // Pass them as modifiers instead, otherwise the imgix provider appends a second `?`.
        const url = computed(() => imageField.value?.url || mediaLinkField.value?.url)
        const modifiers = computed(() => ({ ...(url.value && getQuery(url.value)), ...props.modifiers }))

        return () => h(VImg, {
            ...imgProps.value,
            src: url.value?.split('?')[0],
            modifiers: modifiers.value,
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
