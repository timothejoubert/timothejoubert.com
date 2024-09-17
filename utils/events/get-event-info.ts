import type { TranslateResult } from 'vue-i18n'
import type { EventsApi } from '~/types/event'

export interface EventInfo {
    label?: string | null | TranslateResult
    value?: string | null | TranslateResult
    extra?: boolean
}

function isWhitelisted(item: string, whitelist: string[] | undefined) {
    if (!whitelist) return true

    return whitelist.includes(item)
}

export function getEventInfo(event: EventsApi.Event, whitelist?: string[] | undefined): EventInfo[] {
    const { t } = useI18n()
    const result: EventInfo[] = []

    // locations
    if (event.placesNames && isWhitelisted('placesNames', whitelist)) {
        const places = Object.values(event.placesNames)

        if (places.length) {
            result.push({
                label: t('event.info_places', places.length),
                value: places.join(', '),
            })
        }
    }

    // duration
    if (event.duration && isWhitelisted('duration', whitelist)) {
        result.push({
            label: t('event.info_duration'),
            value: event.duration,
        })
    }

    // ages
    if (event.typicalAgeRange && isWhitelisted('typicalAgeRange', whitelist)) {
        result.push({
            label: t('event.info_age'),
            value: event.typicalAgeRange,
        })
    }

    // prices
    if (event.priceRange && isWhitelisted('price', whitelist)) {
        result.push({
            label: t('event.info_price'),
            value: event.priceRange,
        })
    }

    if (whitelist) return result
    // extra information
    event.attributes
        ?.filter(attribute => typeof attribute.key === 'string')
        .forEach((attribute) => {
            result.push({ label: attribute.key, value: attribute.value, extra: true })
        })

    return result
}
