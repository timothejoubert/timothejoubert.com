import Vue from 'vue'
import type { MetaInfo } from 'vue-meta'
import { Context, NuxtError } from '@nuxt/types'
import { SliceZone } from '@prismicio/types/src/value/sliceZone'
import { FacebookMetaOptions, TwitterMetaOptions } from '~/types/meta'
import { createFacebookMeta } from '~/utils/meta/facebook'
import { createTwitterMeta } from '~/utils/meta/twitter'
import { DocumentPageReachableData } from '~/types/prismic/app-prismic'
import CustomType from '~/constants/custom-type'
import { isHomePageDocument } from '~/utils/prismic/document-entity'
import { isProjectDocument } from '~/utils/prismic/custom-type-entity'
import { SettingsDocument, ProjectDocumentData } from '~~/prismicio-types'
import { getProjectYear } from '~/utils/prismic/date'

function isValidUid(uid: string): boolean {
    return uid === 'projects'
}

export default Vue.extend({
    async asyncData(context: Context) {
        const { $prismic, params, store, route, error } = context

        if (process.server && store.state.firstPageError) {
            error(store.state.firstPageError)
        }

        let page

        const uid = params.pathMatch
        const isProject = store.getters.isProjectUid(uid)

        const isPreview = route.fullPath.includes(`${context.$config.previewPath}/`)
        const isHome = route.fullPath === '/en' || route.fullPath === '/'
        const getByUid = isPreview || isValidUid(uid)

        if (isPreview) {
            page = await $prismic.api.getByID(route.params.documentId)
        } else if (isHome) {
            page = await $prismic.api.getSingle(CustomType.HOME_PAGE)
        } else if (isProject) {
            page = store.getters.getProjectByUid(uid)
        } else if (getByUid) {
            page = await $prismic.api.getByUID(
                CustomType.PAGE,
                isPreview ? route.params.documentId : uid,
                route.fullPath.includes('/en') ? { lang: 'en-gb' } : undefined
            )
        }

        if (page) {
            await store.dispatch('updatePageData', page)
            return { page }
        } else {
            error({
                statusCode: 404,
                message: 'Projet introuvable',
            } as NuxtError)

            const fallBack = { page: { data: {}, title: 'fail to fetch page in mixin' } }
            await store.dispatch('updatePageData', fallBack)
            return fallBack
        }
    },
    head(): MetaInfo {
        const meta = [
            { hid: 'description', name: 'description', content: this.pageDescription },
            { hid: 'version', name: 'version', content: this.$config.version || '' },
            ...createFacebookMeta(this.getFacebookMetaOptions()),
            ...createTwitterMeta(this.getTwitterMetaOptions()),
        ]

        return {
            htmlAttrs: { lang: this.$config.defaultLocale },
            title: this.metaTitle,
            meta,
        }
    },
    computed: {
        pageData(): DocumentPageReachableData {
            return this.page?.data
        },
        appTitle(): string {
            return this.$store.getters.settings?.data?.website_name || this.$config.appName
        },
        metaTitle(): string {
            if (this.isHome) return this.appTitle
            const pageTitle = this.pageData?.meta_title || this.pageData?.title
            return pageTitle ? `${pageTitle} | ${this.appTitle}` : this.appTitle
        },
        pageDescription(): string | undefined {
            const description =
                this.pageData?.meta_description ||
                this.pageData?.content ||
                this.$store.getters.settings?.data?.description
            return Array.isArray(description) ? this.$prismic.asText(description) : description
        },
        metaImage(): string {
            const mediaUrl = (this.pageData?.meta_image as { url?: string })?.url

            return mediaUrl || '/images/share.jpg'
        },
        pageUrl(): string {
            return this.appTitle + this.$route.fullPath.substring(1)
        },
        isHome(): boolean {
            return isHomePageDocument(this.page) || this.$route.fullPath === '/'
        },
        isProjectPage(): boolean {
            return isProjectDocument(this.page)
        },
        slices(): SliceZone[] | false {
            return !!this.page.data?.slices?.length && this.page.data?.slices
        },
        jsonLdPage(): Record<string, unknown> | undefined {
            const siteName =
                (this.$store.getters.settings as SettingsDocument)?.data?.website_name || this.$config.appName
            const baseUrl = this.$config.appUrl

            const websitePersonEntity = {
                name: siteName,
                alternateName: siteName.replace(/\s/g, ''),
                url: baseUrl,
                jobTitle: 'Développeur Front-end et Designer graphique',
            }

            if (this.isHome) {
                return {
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    ...websitePersonEntity,
                    author: {
                        '@type': 'Person',
                        givenName: 'Timothé',
                        familyName: 'Joubert',
                        birthDate: '1998-08-24',
                        url: 'https://timothejoubert.com',
                    },
                }
            } else if (this.isProjectPage) {
                const project = this.pageData as ProjectDocumentData
                const projectContent: Record<string, unknown> = {}
                const media = (project.thumbnail as { url?: string })?.url

                if (project.title) projectContent.name = project.title
                if (media) projectContent.image = media
                if (project.content || project.short_description)
                    projectContent.description =
                        this.$prismic.asText(project.short_description) || this.$prismic.asText(project.content)
                if (project.date) projectContent.copyrightYear = getProjectYear(project.date)

                return {
                    '@context': 'https://schema.org',
                    '@type': 'VisualArtwork',
                    artform: 'Video',
                    artMedium: 'Digital',
                    creator: {
                        '@type': 'Person',
                        ...websitePersonEntity,
                    },
                    ...projectContent,
                }
            } else {
                return undefined
            }
        },
    },
    created() {
        // set the locale for first render on the client side (without asyncData)
        // if (this.page?.lang) this.$i18n.locale = getFormattedLocale(this.page.lang, 'minify')
    },
    methods: {
        getTwitterMetaOptions(): TwitterMetaOptions {
            return {
                title: this.metaTitle,
                description: this.pageDescription,
                url: this.pageUrl,
                image: this.metaImage,
            }
        },
        getFacebookMetaOptions(): FacebookMetaOptions {
            return {
                siteName: this.appTitle,
                title: this.metaTitle,
                description: this.pageDescription,
                url: this.pageUrl,
                image: this.metaImage,
            }
        },
    },
})
