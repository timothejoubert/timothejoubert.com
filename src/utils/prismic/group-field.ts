import { GroupField } from '@prismicio/types/src/value/group'
import { AnyRegularField } from '@prismicio/types/src/value/types'

type BasicFieldContent = Record<string, AnyRegularField>

export function isGroupFulled<T extends BasicFieldContent>(group: unknown): group is GroupField<T, 'filled'> {
    return Array.isArray(group) && group?.length > 0
}

export function filteredMediaGroupByKey<Field = BasicFieldContent>(group: Record<string, Field>, key: string): Field[] {
    // @ts-ignore
    if (isGroupFulled<Field>(group)) {
        // @ts-ignore
        return group.filter((groupKey) => key in groupKey).map((groupKey) => groupKey[key]) // @ts-ignore
    } else {
        return []
    }
}
