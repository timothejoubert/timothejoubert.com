import { FilledLinkToMediaField } from '@prismicio/types/src/value/linkToMedia'
import { FilledImageFieldImage } from '@prismicio/types/src/value/image'
import { PrismicMedia } from '~/types/prismic/app-prismic'

const imageFormat = ['jpg', 'png', 'webp', 'gif']
const videoFormat = ['mp4', 'mov']

function isRelationMediaField(media: PrismicMedia): boolean {
    return 'link_type' in media && 'url' in media && 'name' in media && 'kind' in media
}

function isMediaField(media: PrismicMedia): boolean {
    return 'url' in media && 'dimensions' in media && 'alt' in media && 'copyright' in media
}

export function isMediaByType(media: PrismicMedia, type: 'image' | 'video'): boolean {
    if (isRelationMediaField(media)) {
        const mediaKing = type === 'image' ? 'image' : 'document'

        return (media as FilledLinkToMediaField).kind === mediaKing
    } else if (isMediaField(media)) {
        const url = (media as FilledImageFieldImage).url
        const mediaFormat = type === 'image' ? imageFormat : videoFormat

        return !!url && mediaFormat.some((format: string) => url.endsWith(`.${format}`))
    } else {
        return false
    }
}

export function isImage(media: PrismicMedia) {
    return isMediaByType(media, 'image')
}

export function isVideo(media: PrismicMedia) {
    return isMediaByType(media, 'video')
}
