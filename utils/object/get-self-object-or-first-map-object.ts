export function getSelfObjectOrFirstMapObject<T>(obj: T | T[]): T | undefined {
    if (Array.isArray(obj)) return obj[0]
    else if (obj && typeof obj === 'object') return obj as T
}
