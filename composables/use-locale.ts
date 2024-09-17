import { joinURL } from 'ufo'

function getLocaleLanguage(localeCode: string) {
    if (localeCode.split('-').length) return localeCode.split('-')[0]
    else return localeCode
}

export function useLocale() {
    const route = useRoute()
    const { $i18n } = useNuxtApp()

    const extractLocaleFromUrl = computed(() => {
        return $i18n.locales.value.find((locale) => {
            return route.fullPath.includes(locale.code) || route.fullPath.includes(getLocaleLanguage(locale.code))
        })?.code
    })

    const fetchLocaleOption = computed(() => {
        if (!extractLocaleFromUrl.value)
            return undefined // { lang: $i18n.defaultLocale }
        else return { lang: extractLocaleFromUrl.value }
    })

    function getLocalizedUrl(url: string) {
        const currentLocale = $i18n.locale.value.toLowerCase()

        if (currentLocale === $i18n.defaultLocale.toLowerCase()) {
            return url
        }
        else {
            return joinURL(currentLocale, url)
        }
    }

    return { fetchLocaleOption, getLocalizedUrl }
}
