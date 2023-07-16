<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode } from 'vue'
import { isMediaFulled } from '~/utils/prismic/field-media'
import { PrismicMedia } from '~/types/prismic/app-prismic'
import breakpoint from '~/scss/export/_breakpoints.scss'

export interface VImageProps {
    prismicImage?: PrismicMedia
    nativeImg?: boolean
    ratio?: boolean | number
    url?: string
    placeholder?: boolean
    sizes?: string
}

function generateBreakpoint(width: number = 80): string {
    return Object.keys(breakpoint)
        .map((key) => `${key.split('-')[1]}:${width.toString()}vw`)
        .join(' ')
}

function getSizes(value: string | number | undefined): string {
    if (!value) return generateBreakpoint()
    else if (value === 'fullScreen') return generateBreakpoint(100)
    else if (typeof value === 'number') return generateBreakpoint(value)
    return value
}

export default Vue.extend({
    name: 'VImage',
    props: {
        prismicImage: {
            type: Object as PropType<PrismicMedia>,
        },
        nativeImg: Boolean,
        ratio: { type: [Boolean, Number], default: true },
        url: String,
        placeholder: { type: Boolean, default: true },
        sizes: [String, Number] as PropType<string | 'fullScreen' | number>,
        cover: Boolean,
    },
    data() {
        return {
            loaded: false,
        }
    },
    render(createElement): VNode {
        const { prismicImage, nativeImg, url } = this.$props

        if (!isMediaFulled(prismicImage) && !url) return createElement('')

        const imgTag = nativeImg ? 'img' : 'nuxt-img'

        let width = 0
        if (prismicImage?.width) width = parseFloat(prismicImage.width)

        let height = 0
        if (prismicImage?.height) height = parseFloat(prismicImage.height)

        const attrs: Record<string, any> = {
            placeholder: '15',
            format: 'webp',
            provider: 'prismic',
            quality: '80',
            sizes: getSizes(this.$attrs?.sizes || this.sizes),
            src: nativeImg && url ? url : prismicImage?.url || '/images/fallback-img.jpg',
            copyright: prismicImage?.copyright,
            alt: prismicImage?.alt,
            width: (!this.ratio && width) || '',
            height: (!this.ratio && height) || '',
        }

        const img = createElement(imgTag, {
            attrs,
            class: [this.$style.image],
            on: { load: () => (this.loaded = true) },
        })

        if (this.ratio) {
            const figureStyle: Record<string, string> = {}

            if (typeof this.ratio === 'number') {
                figureStyle.paddingBottom = this.ratio * 100 + '%'
            } else if (width && height) {
                figureStyle.paddingBottom = (height / width) * 100 + '%'
            }

            return createElement(
                'figure',
                {
                    style: figureStyle,
                    class: [
                        this.$style.root,
                        this.ratio && this.$style['root--ratio'],
                        this.cover && this.$style['root--cover'],
                        this.placeholder && this.$style['root--placeholder'],
                        this.loaded && this.$style['root--loaded'],
                    ],
                },
                [img]
            )
        }

        return img
    },
})
</script>

<style lang="scss" module>
.root {
    z-index: var(--v-image-z-index, 1); // create stacking context for preventing crop glitch on Safari
    display: var(--v-image-display, inline-block);
    background-color: var(--v-image-background-color);

    &--ratio {
        position: relative;
        display: var(--v-image-display, block);
    }

    &--placeholder:not(#{&}--loaded) {
        background-color: rgba(0, 0, 0, 0.1);
    }

    &--cover {
        position: absolute;
        inset: 0;
    }
}

.image {
    display: block;
    width: var(--v-image-width, auto);
    max-width: var(--v-image-max-width, 100%);
    height: var(--v-image-height, auto);
    min-height: var(--v-image-min-height, initial);
    aspect-ratio: var(--v-image-aspect-ratio, initial);
    border-radius: var(--v-image-border-radius, 0);
    object-fit: var(--v-image-object-fit, initial);
    object-position: var(--v-image-object-position, initial);
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;

    .root--cover & {
        --v-image-width: 100%;
        --v-image-height: 100%;
        --v-image-object-fit: cover;

        position: absolute;
        top: 0;
        left: 0;
    }

    .root--loaded & {
        opacity: 1;
    }

    .root--ratio & {
        position: absolute;
    }
}
</style>
