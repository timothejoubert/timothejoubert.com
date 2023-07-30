import breakpoints from '~/scss/export/_breakpoints.scss'

interface ScssBreakpoints {
    [key: string]: string
}

interface ObjectBreakpoints {
    [key: string]: number
}

export function getBreakpoints() {
    const entries = Object.entries(breakpoints as ScssBreakpoints)

    return entries
        .sort(([_key, value], [_currentKey, currentValue]) => parseInt(value) - parseInt(currentValue))
        .reduce((accumulator: ObjectBreakpoints, current) => {
            const key = current[0].split('breakpoint-')[1]
            const value = parseInt(current[1])

            if (!accumulator?.[key]) accumulator[key] = value

            return accumulator
        }, {})
}

function getBreakpointKeys(): string[] {
    return Object.keys(getBreakpoints())
}

export function generateImageBreakpoints(width: number = 80): string {
    return getBreakpointKeys()
        .map((key) => `${key}:${width.toString()}vw`)
        .join(' ')
}
