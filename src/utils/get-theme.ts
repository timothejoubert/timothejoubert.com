import themes from '~/scss/export/_themes.scss'
import { ClientTheme, Theme } from '~/types/app'
import predefinedThemes from '~/scss/export/_predefined-themes.scss'

console.log(predefinedThemes)

export function getObjectFormattedTheme(theme: Theme = 'dark') {
    return Object.entries(themes as { string: string }).reduce(
        (accumulator: Partial<ClientTheme>, current: [string, string]) => {
            const key = current[0]
            if (key.includes(`theme-${theme}`)) {
                const parsedKey = key.substring(11, key.lastIndexOf('-')) as keyof ClientTheme
                accumulator[parsedKey] = current[1]
            }
            return accumulator
        },
        {}
    ) as ClientTheme
}

export function getArrayFormattedTheme(theme: Theme = 'dark') {
    return Object.entries(themes as { string: string })
        .filter(([key, _value]) => {
            return key.includes(`theme-${theme}`)
        })
        .reduce((acc: { key: keyof ClientTheme; value: string }[], current) => {
            const key = current[0].substring(11, current[0].lastIndexOf('-')) as keyof ClientTheme
            acc.push({ key, value: current[1] })
            return acc
        }, [])
}

type GetTheme<T extends 'object' | 'array'> = (
    format: T,
    theme: Theme
) => T extends 'array' ? { key: keyof ClientTheme; value: string }[] : ClientTheme

export function getTheme(format: 'object' | 'array', theme: Theme = 'dark') {
    if (format === 'object') return getObjectFormattedTheme(theme)
    else return getArrayFormattedTheme(theme)
}

export function getPredefinedThemes() {
    return Object.entries(predefinedThemes as { string: string }).reduce(
        (accumulator: { [key: string]: { key: string; value: string }[] }, current: [string, string]) => {
            const keySplit = current[0].split('-')
            const key = 'theme-' + keySplit[1]

            if (!accumulator?.[key]) accumulator[key] = []
            accumulator[key].push({ key: keySplit[2], value: current[1] })

            return accumulator
        },
        {}
    )
}
