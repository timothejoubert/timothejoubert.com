import type { PrismicDocument } from '@prismicio/types'

interface useScrollMore {
    fetch: Promise<PrismicDocument[]>
    options: Record<string, unknown>
}

export function useScrollMore() {

}
