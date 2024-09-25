import type { AlternateLanguage } from '@prismicio/types'
import EventType from '~/constants/event-type'
import type {AllDocumentTypes} from "~/prismicio-types";

export interface Page {
    title?: string
    webResponse?: AllDocumentTypes | null
    alternateLinks?: AlternateLanguage[]
    isFirstVisit?:boolean
}

interface UsePageOptions extends Page {}

export function usePage(options?: UsePageOptions) {
    const nextPage = useNextPage()
    const currentPage = useCurrentPage()

    const runtimeConfig = useRuntimeConfig()

    const getTitle = (page?: Page) => {
        const pageTitle = page?.title || page?.webResponse?.data?.meta_title || (page?.webResponse?.data as {title?: string})?.title
        return `${pageTitle} | ${runtimeConfig.public.site.name}`
    }

    nextPage.value = {
        title: getTitle(options),
        webResponse: options?.webResponse,
        alternateLinks: options?.alternateLinks,
    }

    function updateCurrentPage(page: Page) {
        useHead({ title: getTitle(page) })
        useAlternateLinks(page.alternateLinks)
        currentPage.value = {...page}
    }

    const route = useRoute()
    if (route.meta.pageTransition) {
        usePageTransitionEvent(EventType.PAGE_TRANSITION_AFTER_LEAVE, () => {
        updateCurrentPage(nextPage.value)
        })
    } else {
        updateCurrentPage(nextPage.value)
    }
}
