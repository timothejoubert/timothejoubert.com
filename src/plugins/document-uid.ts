import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'
import DocumentUid from '~/constants/document-uid'

export default function (_context: Context, inject: Inject) {
    // @ts-ignore
    inject('documentUid', (value: string): string => DocumentUid[value])
}
