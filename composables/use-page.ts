import type { PrismicDocument, AlternateLanguage } from '@prismicio/types'
import EventType from '~/constants/event-type'

export interface Page {
    title?: string
    webResponse?: PrismicDocument
    alternateLinks?: AlternateLanguage[]
}

interface UsePageOptions extends Page {}

export function usePage(options?: UsePageOptions) {
    console.log('usePage')
    const nextPage = useNextPage()
    const currentPage = useCurrentPage()

    const runtimeConfig = useRuntimeConfig()

    const pageTitle = options?.title || options?.webResponse?.data?.meta_title || options?.webResponse?.data?.title
    const title = `${pageTitle} | ${runtimeConfig.public.site.name}`

    nextPage.value = {
        title,
        webResponse: options?.webResponse,
        alternateLinks: options?.alternateLinks,
    }

    if (!currentPage.value?.webResponse || !currentPage.value?.title) {
        currentPage.value = { ...nextPage.value }
    }

    watch(
        currentPage,
        () => {
            console.log('watch page', nextPage.value.webResponse?.url)
            useHead({ title })
            useAlternateLinks(nextPage.value.alternateLinks)
        },
        { deep: true, immediate: true },
    )

    usePageTransitionEvent(EventType.PAGE_TRANSITION_AFTER_LEAVE, () => {
        currentPage.value = { ...nextPage.value }
    })
}
