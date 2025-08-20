import { joinURL } from 'ufo'

export function getFormattedLocale(localeCode: string | undefined) {
    if (localeCode?.split('-').length) return localeCode.split('-')[0]
    return localeCode
}

export function useLocale() {
    const route = useRoute()
    const { $i18n } = useNuxtApp()

    const availableLocaleCodes = computed(() => $i18n.locales.value.map(locale => getFormattedLocale(locale.code) || locale.code))

    const extractLocaleFromUrl = computed(() => {
        return availableLocaleCodes.value.find((localeCode) => {
            return route.fullPath.includes(localeCode)
        })
    })

    const fetchLocaleOption = computed(() => {
        if (!extractLocaleFromUrl.value) {
            return undefined // { lang: $i18n.defaultLocale }
        }
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
