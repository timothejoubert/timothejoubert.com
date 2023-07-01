import Vue from 'vue'
import { DefaultProps } from '@nuxt/types/app/vue'

declare module '*.vue' {
    export default Vue
}

/**
 * fix CSS module
 * @see https://stackoverflow.com/a/53999913
 */

declare module 'vue/types/vue' {
    interface Vue {
        $style: { [key: string]: string }
        $documentUid(value: string): string
        $getLocalePath(): string
        $asHtml(richText: any | undefined, linkResolver: any, htmlSerializer: any): string | undefined
        $asText(richText?: any, joinString?: string): string
        $asLink(link: any, linkResolver: any): string | undefined
        $asDate(date: any): string | undefined
    }
}

declare module 'vue/types/options' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface RenderContext<Props = DefaultProps> {
        $style: { [key: string]: string }
    }
}
