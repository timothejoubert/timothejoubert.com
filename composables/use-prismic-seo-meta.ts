import { joinURL } from 'ufo'
import type { PrismicDocument } from '@prismicio/types'

export async function usePrismicSeoMeta(webResponse?: PrismicDocument) {
    const nuxtApp = useNuxtApp()
    const commonContent = await usePrismicSettingsDocument()
    const runtimeConfig = useRuntimeConfig()

    const siteName = commonContent.value?.data?.website_name || (nuxtApp.$config.siteName as string) || ''
    const title = webResponse?.data?.meta_title || webResponse?.data?.title || siteName
    const description = webResponse?.data?.meta_description || (commonContent.value?.data as { metaDescription?: string })?.metaDescription

    const img = useImage()
    // TODO: change img provider
    const image = () => {
        const image = commonContent.value?.data.meta_image.url

        if (image) {
            return img(
                image,
                {
                    width: 1200,
                    crop: '1200x630',
                    quality: 70,
                },
                {
                    provider: 'interventionRequest',
                },
            )
        }
        else {
            return joinURL(runtimeConfig.public.site.url, '/images/share.jpg')
        }
    }

    useServerSeoMeta({
        description,
        ogTitle: title,
        ogSiteName: siteName,
        ogDescription: description,
        ogImage: image(),
        twitterCard: 'summary',
        twitterTitle: title,
        twitterDescription: description,
    })
}
