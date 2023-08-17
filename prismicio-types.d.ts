// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from '@prismicio/types'
import type * as prismicClient from '@prismicio/client'

type Simplify<T> = {
    [KeyType in keyof T]: T[KeyType]
}
/** Content for Home page documents */
interface HomePageDocumentData {
    /**
     * Title field in *Home page*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: home_page.title
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    title: prismic.KeyTextField
    /**
     * Meta Description field in *Home page*
     *
     * - **Field Type**: Text
     * - **Placeholder**: A brief summary of the page
     * - **API ID Path**: home_page.meta_description
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_description: prismic.KeyTextField
    /**
     * Meta Image field in *Home page*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: home_page.meta_image
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    meta_image: prismic.ImageField<never>
    /**
     * Meta Title field in *Home page*
     *
     * - **Field Type**: Text
     * - **Placeholder**: A title of the page used for social media and search engines
     * - **API ID Path**: home_page.meta_title
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_title: prismic.KeyTextField
}
/**
 * Home page document from Prismic
 *
 * - **API ID**: `home_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomePageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
    Simplify<HomePageDocumentData>,
    'home_page',
    Lang
>
/** Content for Project documents */
interface ProjectDocumentData {
    /**
     * Title field in *Project*
     *
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: project.title
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    title: prismic.KeyTextField
    /**
     * Favorite field in *Project*
     *
     * - **Field Type**: Boolean
     * - **Placeholder**: *None*
     * - **Default Value**: false
     * - **API ID Path**: project.favorite
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/boolean
     *
     */
    favorite: prismic.BooleanField
    /**
     * Tag group field in *Project*
     *
     * - **Field Type**: Group
     * - **Placeholder**: *None*
     * - **API ID Path**: project.tag_group[]
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/group
     *
     */
    tag_group: prismic.GroupField<Simplify<ProjectDocumentDataTagGroupItem>>
    /**
     * Framework field in *Project*
     *
     * - **Field Type**: Select
     * - **Placeholder**: *None*
     * - **API ID Path**: project.framework
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/select
     *
     */
    framework: prismic.SelectField<'Freelance' | 'Perso' | 'Rézo zéro' | 'Master 2' | 'DSAA' | 'DEC' | 'BTS' | 'STD2A'>
    /**
     * Short description field in *Project*
     *
     * - **Field Type**: Rich Text
     * - **Placeholder**: *None*
     * - **API ID Path**: project.short_description
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/rich-text-title
     *
     */
    short_description: prismic.RichTextField
    /**
     * Content field in *Project*
     *
     * - **Field Type**: Rich Text
     * - **Placeholder**: *None*
     * - **API ID Path**: project.content
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/rich-text-title
     *
     */
    content: prismic.RichTextField
    /**
     * Thumbnail field in *Project*
     *
     * - **Field Type**: Link to Media
     * - **Placeholder**: *None*
     * - **API ID Path**: project.thumbnail
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/link-content-relationship
     *
     */
    thumbnail: prismic.LinkToMediaField
    /**
     * Date field in *Project*
     *
     * - **Field Type**: Date
     * - **Placeholder**: *None*
     * - **API ID Path**: project.date
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/date
     *
     */
    date: prismic.DateField
    /**
     * Link field in *Project*
     *
     * - **Field Type**: Link
     * - **Placeholder**: *None*
     * - **API ID Path**: project.link
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/link-content-relationship
     *
     */
    link: prismic.LinkField
    /**
     * Link label field in *Project*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: project.link_label
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    link_label: prismic.KeyTextField
    /**
     * Medias field in *Project*
     *
     * - **Field Type**: Group
     * - **Placeholder**: *None*
     * - **API ID Path**: project.medias[]
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/group
     *
     */
    medias: prismic.GroupField<Simplify<ProjectDocumentDataMediasItem>>
    /**
     * Meta Description field in *Project*
     *
     * - **Field Type**: Text
     * - **Placeholder**: A brief summary of the page
     * - **API ID Path**: project.meta_description
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_description: prismic.KeyTextField
    /**
     * Meta Image field in *Project*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: project.meta_image
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    meta_image: prismic.ImageField<never>
    /**
     * Meta Title field in *Project*
     *
     * - **Field Type**: Text
     * - **Placeholder**: A title of the page used for social media and search engines
     * - **API ID Path**: project.meta_title
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_title: prismic.KeyTextField
}
/**
 * Item in Project → Tag group
 *
 */
export interface ProjectDocumentDataTagGroupItem {
    /**
     * Tag field in *Project → Tag group*
     *
     * - **Field Type**: Select
     * - **Placeholder**: *None*
     * - **API ID Path**: project.tag_group[].tag
     * - **Documentation**: https://prismic.io/docs/core-concepts/select
     *
     */
    tag: prismic.SelectField<
        | 'Développement'
        | 'Typographie'
        | "Design d'interface"
        | 'Identité visuelle'
        | 'Code créatif'
        | 'Motion design'
        | 'Édition'
        | 'Illustration'
        | 'Expression plastique'
        | 'Multimédia'
    >
}
/**
 * Item in Project → Medias
 *
 */
export interface ProjectDocumentDataMediasItem {
    /**
     * Media field in *Project → Medias*
     *
     * - **Field Type**: Link to Media
     * - **Placeholder**: *None*
     * - **API ID Path**: project.medias[].media
     * - **Documentation**: https://prismic.io/docs/core-concepts/link-content-relationship
     *
     */
    media: prismic.LinkToMediaField
    /**
     * Embed url field in *Project → Medias*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: project.medias[].embed_url
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    embed_url: prismic.KeyTextField
}
/**
 * Project document from Prismic
 *
 * - **API ID**: `project`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<
    Simplify<ProjectDocumentData>,
    'project',
    Lang
>
/** Content for Settings documents */
interface SettingsDocumentData {
    /**
     * Website name field in *Settings*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.website_name
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    website_name: prismic.KeyTextField
    /**
     * About title field in *Settings*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.about_title
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    about_title: prismic.KeyTextField
    /**
     * About content field in *Settings*
     *
     * - **Field Type**: Rich Text
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.about_content
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/rich-text-title
     *
     */
    about_content: prismic.RichTextField
    /**
     * Email field in *Settings*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.email
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    email: prismic.KeyTextField
    /**
     * Display all projects field in *Settings*
     *
     * - **Field Type**: Boolean
     * - **Placeholder**: *None*
     * - **Default Value**: false
     * - **API ID Path**: settings.display_all_projects
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/boolean
     *
     */
    display_all_projects: prismic.BooleanField
    /**
     * columns field in *Settings*
     *
     * - **Field Type**: Group
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.columns[]
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/group
     *
     */
    columns: prismic.GroupField<Simplify<SettingsDocumentDataColumnsItem>>
    /**
     * Socials field in *Settings*
     *
     * - **Field Type**: Group
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.socials[]
     * - **Tab**: Main
     * - **Documentation**: https://prismic.io/docs/core-concepts/group
     *
     */
    socials: prismic.GroupField<Simplify<SettingsDocumentDataSocialsItem>>
    /**
     * Meta Description field in *Settings*
     *
     * - **Field Type**: Text
     * - **Placeholder**: A brief summary of the page
     * - **API ID Path**: settings.meta_description
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_description: prismic.KeyTextField
    /**
     * Meta Image field in *Settings*
     *
     * - **Field Type**: Image
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.meta_image
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/image
     *
     */
    meta_image: prismic.ImageField<never>
    /**
     * Meta Title field in *Settings*
     *
     * - **Field Type**: Text
     * - **Placeholder**: A title of the page used for social media and search engines
     * - **API ID Path**: settings.meta_title
     * - **Tab**: SEO & Metadata
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    meta_title: prismic.KeyTextField
}
/**
 * Item in Settings → columns
 *
 */
export interface SettingsDocumentDataColumnsItem {
    /**
     * Title field in *Settings → columns*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.columns[].title
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    title: prismic.KeyTextField
    /**
     * Content field in *Settings → columns*
     *
     * - **Field Type**: Rich Text
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.columns[].content
     * - **Documentation**: https://prismic.io/docs/core-concepts/rich-text-title
     *
     */
    content: prismic.RichTextField
}
/**
 * Item in Settings → Socials
 *
 */
export interface SettingsDocumentDataSocialsItem {
    /**
     * Social field in *Settings → Socials*
     *
     * - **Field Type**: Select
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.socials[].social
     * - **Documentation**: https://prismic.io/docs/core-concepts/select
     *
     */
    social: prismic.SelectField<
        'Instagram' | 'Facebook' | 'Youtube' | 'Vimeo' | 'TikTok' | 'Behance' | 'LinkedIn' | 'Github'
    >
    /**
     * Link field in *Settings → Socials*
     *
     * - **Field Type**: Link
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.socials[].link
     * - **Documentation**: https://prismic.io/docs/core-concepts/link-content-relationship
     *
     */
    link: prismic.LinkField
    /**
     * Label field in *Settings → Socials*
     *
     * - **Field Type**: Text
     * - **Placeholder**: *None*
     * - **API ID Path**: settings.socials[].label
     * - **Documentation**: https://prismic.io/docs/core-concepts/key-text
     *
     */
    label: prismic.KeyTextField
}
/**
 * Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/core-concepts/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<
    Simplify<SettingsDocumentData>,
    'settings',
    Lang
>
export type AllDocumentTypes = HomePageDocument | ProjectDocument | SettingsDocument
declare module '@prismicio/client' {
    interface CreateClient {
        (repositoryNameOrEndpoint: string, options?: prismicClient.ClientConfig): prismicClient.Client<AllDocumentTypes>
    }
    namespace Content {
        export type {
            HomePageDocumentData,
            HomePageDocument,
            ProjectDocumentData,
            ProjectDocumentDataTagGroupItem,
            ProjectDocumentDataMediasItem,
            ProjectDocument,
            SettingsDocumentData,
            SettingsDocumentDataColumnsItem,
            SettingsDocumentDataSocialsItem,
            SettingsDocument,
            AllDocumentTypes,
        }
    }
}
