<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode, VNodeData } from 'vue'
import VVideo, { VVideoProps } from '~/components/molecules/VVideo.vue'
import { isImage, isVideo } from '~/utils/prismic/media'
import { PrismicMedia } from '~/types/prismic/app-prismic'
import VImage, { VImageProps } from '~/components/molecules/VImage.vue'

export default Vue.extend({
    name: 'VMedia',
    functional: true,
    props: {
        document: Object as PropType<PrismicMedia>,
        video: Object as PropType<Omit<VVideoProps, 'prismicMedia'>>,
        image: Object as PropType<VImageProps>,
    },
    render(createElement, context): VNode {
        const { props } = context
        const document = props.document
        if (!document) return createElement('')

        const data: VNodeData = {
            ...context.data,
            class: context.data.class,
            props: context.props,
        }
        const tag = isImage(document) ? VImage : isVideo(document) ? VVideo : ''

        if (isVideo(document)) {
            data.props = {
                ...data.props,
                ...props.video,
                prismicMedia: document,
            } as VVideoProps
        } else if (isImage(document)) {
            data.props = {
                ...data.props,
                ...props.image,
                prismicImage: document,
            } as VImageProps
        }

        return createElement(tag, data, context.slots()?.default)
    },
})
</script>
