// https://github.com/nuxt-modules/prismic/issues/62
// this was from another solution, I just added because it's useful
// import type { getApi } from 'prismic-javascript'
// import ResolvedApi from '@prismicio/client/types/ResolvedApi'
// import { DefaultClient } from 'prismic-javascript/types/client'
import type { DefaultClient } from '@prismicio/client/types/client'
import { Module } from '@nuxt/types'
import ResolvedApi from '@prismicio/client/types/ResolvedApi'
import Prismic from '@prismicio/client/types/index'

// import Vue from 'vue'

type ThenArg<T> = T extends Promise<infer U> ? U : T
type PrismicAPIPromise = ReturnType<typeof Prismic.getApi>
type PrismicAPI = ThenArg<PrismicAPIPromise>

type ElementType =
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'heading4'
    | 'heading5'
    | 'heading6'
    | 'paragraph'
    | 'preformatted'
    | 'strong'
    | 'em'
    | 'list-item'
    | 'o-list-item'
    | 'group-list-item'
    | 'group-o-list-item'
    | 'image'
    | 'embed'
    | 'hyperlink'
    | 'label'
    | 'span'

type Elements = { [key in ElementType]: string }

type HTMLSerializer<T> = (type: ElementType, element: any, text: string | null, children: T[], index: number) => T

interface RichText {
    Elements: Elements

    asHtml(richText: any, linkResolver?: (doc: any) => string, serializer?: HTMLSerializer<string>): string

    asText(richText: any, joinString?: string): string
}

interface Link {
    url(link: any, linkResolver?: (doc: any) => string): string
}

interface VuePrismic {
    endpoint: string
    linkResolver: (doc: any) => string
    htmlSerializer: HTMLSerializer<string>
    client: DefaultClient
    richTextAsPlain: (field: string) => string
}

type PrismicVue<T> = VuePrismic & T

declare module '@nuxt/types' {
    interface Context {
        $prismic: PrismicVue<PrismicAPI> & RichText & { api: ResolvedApi } & typeof Prismic
    }
}

// here's the solution
declare module 'vue/types/vue' {
    interface Vue {
        $prismic: PrismicVue<PrismicAPI> & RichText & { api: ResolvedApi } & typeof Prismic
    }
}

interface PrismicModuleOptions {}

declare const prismicModule: Module<PrismicModuleOptions>

export default prismicModule
