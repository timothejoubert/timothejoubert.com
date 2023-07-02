<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode } from 'vue'
import { isMediaFulled } from '~/utils/prismic/field-media'
import { PrismicMedia } from '~/types/prismic/app-prismic'
import breakpoint from '~/scss/export/_breakpoints.scss'

const FALLBACK_ALT = 'Illustration de Hugo Tomasi'

export interface VImageProps {
    prismicImage?: PrismicMedia
    nativeImg?: boolean
    ratio?: boolean | number
    url?: string
    placeholder?: boolean
    sizes?: string
}

function generateBreakpoint(width: number = 70): string {
    return Object.keys(breakpoint)
        .map((key) => `${key.split('-')[1]}:${width.toString()}vw`)
        .join(' ')
}

function getSizes(value: string | undefined): string {
    if (!value) return generateBreakpoint()
    else if (value === 'fullScreen') return generateBreakpoint(100)
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
        sizes: String as PropType<string | 'fullScreen'>,
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
        if (prismicImage?.dimensions?.width) width = parseFloat(prismicImage.dimensions.width)

        let height = 0
        if (prismicImage?.dimensions?.height) height = parseFloat(prismicImage.dimensions.height)

        const attrs: Record<string, any> = {
            placeholder: '15',
            format: 'webp',
            provider: 'prismic',
            quality: '80',
            sizes: getSizes(this.$attrs?.sizes || this.sizes),
            src: nativeImg && url ? url : prismicImage?.url || '/images/fallback-img.jpg',
            copyright: prismicImage?.copyright,
            alt: prismicImage?.alt || FALLBACK_ALT,
            width: (!this.ratio && width) || '',
            height: (!this.ratio && height) || '',
        }

        const img = createElement(imgTag, {
            attrs,
            class: [this.$style.root, this.loaded && this.$style['root--loaded']],
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
    border-radius: var(--v-image-border-radius, 0);
    transition: var(--v-image-transition, none);

    &--ratio {
        position: relative;
        display: var(--v-image-display, block);
    }

    &--cover {
        position: absolute;
        inset: 0;
    }
}

img {
    display: block;
    width: var(--v-image-width, auto);
    max-width: var(--v-image-max-width, 100%);
    height: var(--v-image-height, auto);
    min-height: var(--v-image-min-height, initial);
    aspect-ratio: var(--v-image-aspect-ratio, initial);
    object-fit: var(--v-image-object-fit, initial);
    object-position: var(--v-image-object-position, initial);
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;

    .root--cover &,
    .root--ratio & {
        position: absolute;
        top: 0;
        left: 0;
        width: var(--v-image-width, 100%);
        height: var(--v-image-height, 100%);
        object-fit: var(--v-image-object-fit, cover);
    }

    .root--lazy & {
        opacity: 0;
        transition: var(--v-image-img-transition, all 0s), opacity 0.3s;
    }

    .root--loaded & {
        opacity: 1;
    }
}


.copyright {
    --v-information-pill-background-volor: #{rgba(color(white), 0.5)};

    position: absolute;
    right: var(--v-image-copyright-right, rem(22));
    bottom: var(--v-image-copyright-bottom, rem(16));
}
</style>
