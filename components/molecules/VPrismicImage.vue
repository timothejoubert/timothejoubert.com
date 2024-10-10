<script lang="ts">
import type { PropType } from 'vue'
import { hash } from 'ohash'
import type { ImageField, LinkToMediaField } from '@prismicio/types'
import pick from 'lodash/pick'
import { LazyVCopyright, VImg, VPicture } from '#components'
import { imgProps } from '#image/components/NuxtImg'
import { pictureProps } from '#image/components/NuxtPicture'

import type { Writeable } from '~/utils/types'
import { imgixProviderAttributes, type ImgixProviderPropsKeys } from '~/utils/image/imgix'

type PossiblePrismicMedia = LinkToMediaField | ImageField

export const vRoadizImageProps = {
    ...imgProps,
    ...pictureProps,
    ...imgixProviderAttributes,
    document: Object as PropType<PossiblePrismicMedia>,
    tag: String as PropType<'picture' | 'img'>,
    copyright: [String, Boolean],
}

export default defineComponent({
    props: vRoadizImageProps,
    setup(props, { slots }) {
        const $style = useCssModule()
        const document = computed(() => props.document)

        const modifiers = computed(() => {
            return pick<Writeable<typeof props>, ImgixProviderPropsKeys>(
                props,
                Object.keys(imgixProviderAttributes) as Array<ImgixProviderPropsKeys>,
            )
        })

        const cropDimensions = computed(() => modifiers.value?.crop?.split('x') || [])
        const width = computed(() => cropDimensions.value[0] || props?.width || document.value?.dimensions.width)
        const height = computed(() => cropDimensions.value[1] || props?.height || document.value?.dimensions.height)
        const isPicture = computed(() => !!slots.default || props.tag === 'picture')
        const src = computed(() => {
            const src = document.value?.thumbnail?.relativePath || document.value?.url
            const queryIndex = src.indexOf('?')

            return queryIndex === -1 ? src : src.substring(0, queryIndex)
        })
        console.log('src', src.value)

        const copyright = computed(
            () =>
                (typeof props.copyright === 'string' && props.copyright)
                || (props.copyright === true && document.value?.copyright),
        )

        const $img = useImage()
        const getFormat = () => props.format || !document.value?.processable ? undefined : 'jpeg'

        const imageComponentProps = computed(() => {
            return {
                ...pick(props, Object.keys(isPicture.value ? pictureProps : imgProps)),
                src: src.value,
                width: width.value,
                height: height.value,
                alt: document.value?.alt || document.value?.name,
                placeholder: document.value?.imageAverageColor || '#ddd',
                format: getFormat(),
                sizes:
                    props.sizes
                    || (!isPicture.value
                        && !props.densities
                        && ($img.options.presets?.default?.sizes || $img.options.screens))
                        || undefined,
                provider: 'imgix',
                modifiers: {
                    ...modifiers.value,
                    auto: props.auto || 'format,compress',
                    format: getFormat(),
                },
            }
        })
        console.log('props', imageComponentProps.value)

        const imageComponent = h(isPicture.value ? VPicture : VImg, imageComponentProps.value, slots.default)

        return () => {
            if (copyright.value) {
                const id = `figure-${hash(imageComponentProps.value)}`

                return (
                    h('figure', {
                        id: id,
                        class: [$style.root, $style['root--copyright']],
                    }, [
                        imageComponent,
                        h(LazyVCopyright, {
                            content: copyright.value,
                            container: `#${id}`,
                        }),
                    ]))
            }

            return imageComponent
        }
    },
})
</script>

<style lang="scss" module>
.root {
    &--copyright {
        position: relative;
        margin: initial;

        img {
            display: block;
        }
    }
}
</style>
