export function isObject(obj: unknown): obj is Record<string, unknown> {
    return !!obj && typeof obj === 'object'
}
