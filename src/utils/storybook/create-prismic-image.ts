import { FilledLinkToMediaField} from "@prismicio/types/src/value/linkToMedia";
import { FilledImageFieldImage, ImageField, ImageFieldImage} from "@prismicio/types/src/value/image";

export function createLinkToMediaField(mediaLink?: NonNullable<FilledLinkToMediaField>): FilledLinkToMediaField {
    return {
        link_type: mediaLink?.link_type || "Media", //
        url: mediaLink?.url || 'https://images.prismic.io/slicemachine-blank/26d81419-4d65-46b8-853e-8ea902e160c1_groovy.png?auto=compress,format',
        size: mediaLink?.size || "201892",
        height: mediaLink?.height || "1536",
        width: mediaLink?.width || "2048",
        name: 'name',
        kind: 'kind',
    }
}

export function createPrismicImage(prismicImage?: Partial<FilledImageFieldImage>): FilledImageFieldImage {
    return {
        dimensions: {
            width: 300,
            height: 300,
        },
        alt: 'alt img',
        copyright: 'Copyright img',
        url: 'https://images.prismic.io/slicemachine-blank/26d81419-4d65-46b8-853e-8ea902e160c1_groovy.png?auto=compress,format',
        ...prismicImage,
    }
}
