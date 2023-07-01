import themes from '~/scss/export/_themes.scss'
import { Theme } from '~/types/app'

interface ThemeContent {
    [Key: string]: string
}

type ThemeMap = {
    [key in Theme]: ThemeContent
}

export const getCSSVarFromTheme = (theme: string): Record<string, string> => {
    const wrapperStyle: Record<string, string> = {}

    for (const key in themes) {
        if (key.includes(theme)) {
            const cssVarKey = '--' + key.substring(0, key.lastIndexOf('-'))
            wrapperStyle[cssVarKey] = themes[key]
            if (cssVarKey === '--theme-default') wrapperStyle.backgroundColor = themes[key]
            if (cssVarKey === '--theme-on-default') wrapperStyle.color = themes[key]
        }
    }
    return wrapperStyle
}

export const getThemes = (): ThemeMap => {
    const themeNames: Partial<ThemeMap> = {}

    for (const key in themes) {
        const themeName = key.substring(key.lastIndexOf('-') + 1, key.length) as Theme
        const themeKey = '--' + key.substring(0, key.lastIndexOf('-'))
        const isStoredThemeName = Object.prototype.hasOwnProperty.call(themeNames, themeName)
        const value = themes[key]

        if (isStoredThemeName) {
            ;(themeNames[themeName] as ThemeContent)[themeKey] = value
        } else {
            themeNames[themeName] = { [themeKey]: value }
        }
    }

    return themeNames as ThemeMap
}

interface StorybookBackground {
    name: string
    value: string
}

export const getMainThemesValue = (): StorybookBackground[] => {
    const themes = getThemes()
    const themeKeys = Object.keys(themes) as Theme[]
    return themeKeys.map((themeKey) => {
        return { name: themeKey, value: themes[themeKey]['--theme-default'] }
    })
}

// function isThemeContent(themeContent: Partial<ThemeContent> | undefined): themeContent is ThemeContent {
//     return (
//         (themeContent && !!Object.prototype.hasOwnProperty.call(themeContent, 'light')) ||
//         !!Object.prototype.hasOwnProperty.call(themeContent, 'dark')
//     )
// }
