import DocumentUid from '~/constants/document-uid'

export const slugify = (text: string | null | undefined): string => {
    return text
        ? text
              .toString() // Cast to string (optional)
              .normalize('NFD') // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
              .replace(/[\u0300-\u036F]/g, '')
              .toLowerCase() // Convert the string to lowercase letters
              .trim() // Remove whitespace from both sides of a string (optional)
              .replace(/\s+/g, '-') // Replace spaces with -
        : 'no-found-name'
    // .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    // .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

export function getDistance(xA: number, xB: number, yA: number, yB: number) {
    const xDiff = xA - xB
    const yDiff = yA - yB

    return Math.sqrt(xDiff * xDiff - yDiff * yDiff)
}

export const clamp = (value: number, min: number, max: number): number => {
    return Math.max(min, Math.min(value, max))
}

export const mapRange = (value: number, a: number, b: number, c: number, d: number): number => {
    value = (value - a) / (b - a)
    return c + value * (d - c)
}
export const lerp = (a: number, b: number, n: number): number => {
    return (1 - n) * a + n * b
}

export const getRandomFromRange = (min: number, max: number, decimals: number = 0) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals)

    return parseFloat(str)
}
export const nameIfy = (text: string | null | undefined): string => {
    return text?.replace(/[-_.'"]/g, ' ') || 'text undefined'
}

export const getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getCssProp = (item: HTMLElement = document.documentElement, propName: string) => {
    return getComputedStyle(item).getPropertyValue(propName)
}

export const setCssProp = (propName: string, value: string) => {
    return document.documentElement.style.setProperty(propName, value)
}

export const removeCssProp = (propName: string) => {
    return document.documentElement.style.setProperty(propName, null)
}

export function generateId(): string {
    const a = new Uint32Array(3)
    window.crypto.getRandomValues(a)
    return (
        performance.now().toString(36) +
        Array.from(a)
            .map((A) => A.toString(36))
            .join('')
    ).replace(/\./g, '')
}

export const stringDateToYear = (
    date: string | null | undefined,
    position: number = 0,
    separator: string = '-'
): number | null => {
    if (!date) return null
    const items = date.split(separator)
    return Number(items[position])
}

export function convertRemToPixels(rem: string) {
    return Number(rem) * parseFloat(getComputedStyle(document.documentElement).fontSize)
}
