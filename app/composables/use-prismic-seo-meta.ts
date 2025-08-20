import { joinURL } from 'ufo'
import type { ReachableDocument } from '~/types/api'

function getValue(obj: Record<string, unknown> | undefined, key: string, deepKey?: string) {
    const value = obj && key in obj && typeof obj[key]
    if (!value) return undefined

    if (typeof value === 'string' && !deepKey) {
        return value as string
    }

    if (deepKey && typeof value === 'object' && deepKey in value && typeof value[deepKey] === 'string') {
        return value[deepKey]
    }

    return undefined
}

export function usePrismicSeoMeta(document: ReachableDocument) {
    const config = useRuntimeConfig()
    const siteName = config.public.site.name
    const siteUrl = config.public.site.url

    const title = document.data?.meta_title || getValue(document.data, 'title') || siteName
    const description = document.data?.meta_description || usePrismicText(getValue(document.data, 'content')).value
    const apiImgUrl = document.data?.meta_image?.url || getValue(document.data, 'image', 'url')

    const generateImg = useImage()
    const image = apiImgUrl
        ? generateImg(
                apiImgUrl,
                {
                    width: 1200,
                    height: 700,
                },
                {
                    provider: 'imgix',
                    modifiers: {
                        fit: 'crop',
                    },
                },
            )
        : joinURL(siteUrl, '/share.jpg')

    const { path } = useRoute()

    useSeoMeta({
        ogSiteName: siteName,
        ogTitle: title,
        description,
        ogDescription: description,
        twitterDescription: description,
        twitterCard: 'summary',
        twitterTitle: title,
        ogImage: image,
        ogImageWidth: '1200',
        ogImageHeight: '700',
        twitterImage: image,
        ogUrl: joinURL(siteUrl, document.url || path),
    })
}
