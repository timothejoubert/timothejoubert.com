let result: boolean | undefined

// @see https://developer.mozilla.org/fr/docs/Web/API/EventTarget/addEventListener
export function isPassiveSupported() {
    if (typeof result === 'undefined') {
        try {
            const options: any = Object.defineProperty({}, 'passive', {
                get(): void {
                    result = true
                },
            })

            window.addEventListener('test', options, options)
            window.removeEventListener('test', options, options)
        } catch (err) {
            result = false
        }
    }

    return result
}
