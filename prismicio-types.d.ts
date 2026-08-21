import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

type AboutDocumentDataSlicesSlice = never

/**
 * Item in *about → Formations*
 */
export interface AboutDocumentDataFormationsItem {
	/**
	 * Titre field in *about → Formations*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.formations[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Contenu field in *about → Formations*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.formations[].content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Lieu field in *about → Formations*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.formations[].place
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	place: prismic.KeyTextField;
	
	/**
	 * Date field in *about → Formations*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.formations[].date
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	date: prismic.DateField;
	
	/**
	 * Lien field in *about → Formations*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.formations[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Item in *about → Expériences*
 */
export interface AboutDocumentDataExperiencesItem {
	/**
	 * Titre field in *about → Expériences*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.experiences[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Contenu field in *about → Expériences*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.experiences[].content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Lieu field in *about → Expériences*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.experiences[].place
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	place: prismic.KeyTextField;
	
	/**
	 * Date field in *about → Expériences*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.experiences[].date
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	date: prismic.DateField;
	
	/**
	 * Lien field in *about → Expériences*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.experiences[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
}

/**
 * Content for about documents
 */
interface AboutDocumentData {
	/**
	 * title field in *about*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * content field in *about*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Slice Zone field in *about*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<AboutDocumentDataSlicesSlice>;
	
	/**
	 * Formations field in *about*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.formations[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	formations: prismic.GroupField<Simplify<AboutDocumentDataFormationsItem>>;
	
	/**
	 * Expériences field in *about*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.experiences[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	experiences: prismic.GroupField<Simplify<AboutDocumentDataExperiencesItem>>;/**
	 * Meta Title field in *about*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: about.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *about*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: about.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *about*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: about.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * about document from Prismic
 *
 * - **API ID**: `about`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type AboutDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<AboutDocumentData>, "about", Lang>;

type ArchiveDocumentDataSlicesSlice = never

/**
 * Content for archive documents
 */
interface ArchiveDocumentData {
	/**
	 * title field in *archive*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: archive.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * content field in *archive*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: archive.content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Slice Zone field in *archive*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: archive.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ArchiveDocumentDataSlicesSlice>;/**
	 * Meta Title field in *archive*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: archive.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *archive*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: archive.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *archive*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: archive.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * archive document from Prismic
 *
 * - **API ID**: `archive`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ArchiveDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ArchiveDocumentData>, "archive", Lang>;

/**
 * Content for Home page documents
 */
interface HomePageDocumentData {
	/**
	 * Title field in *Home page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;/**
	 * Meta Description field in *Home page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: home_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Home page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *Home page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: home_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
}

/**
 * Home page document from Prismic
 *
 * - **API ID**: `home_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomePageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomePageDocumentData>, "home_page", Lang>;

/**
 * Content for Menu documents
 */
interface MenuDocumentData {
	/**
	 * Title field in *Menu*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: menu.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Links field in *Menu*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: menu.links
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	links: prismic.Repeatable<prismic.LinkField<string, string, unknown, prismic.FieldState, never>>;
}

/**
 * Menu document from Prismic
 *
 * - **API ID**: `menu`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type MenuDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<MenuDocumentData>, "menu", Lang>;

/**
 * Item in *Project → Awards*
 */
export interface ProjectDocumentDataAwardsItem {
	/**
	 * Name field in *Project → Awards*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.awards[].name
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	name: prismic.KeyTextField;
	
	/**
	 * link field in *Project → Awards*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.awards[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * type field in *Project → Awards*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.awards[].type
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	type: prismic.SelectField<"book" | "web">;
}

/**
 * Item in *Project → Tag group*
 */
export interface ProjectDocumentDataTagGroupItem {
	/**
	 * Tag field in *Project → Tag group*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.tag_group[].tag
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	tag: prismic.SelectField<"Développement" | "Typographie" | "Design d'interface" | "Identité visuelle" | "Code créatif" | "Motion design" | "Édition" | "Illustration" | "Expression plastique" | "Multimédia">;
}

/**
 * Item in *Project → Medias*
 */
export interface ProjectDocumentDataMediasItem {
	/**
	 * Media field in *Project → Medias*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.medias[].media
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	media: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Embed url field in *Project → Medias*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.medias[].embed_url
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	embed_url: prismic.KeyTextField;
	
	/**
	 * sound enabled field in *Project → Medias*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: project.medias[].sound_enabled
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	sound_enabled: prismic.BooleanField;
}

/**
 * Content for Project documents
 */
interface ProjectDocumentData {
	/**
	 * Title field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Favorite field in *Project*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: project.favorite
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	favorite: prismic.BooleanField;
	
	/**
	 * Type (schema.org) field in *Project*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.creative_work_type
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	creative_work_type: prismic.SelectField<"CreativeWork" | "WebSite" | "SoftwareApplication" | "VisualArtwork" | "VideoObject">;
	
	/**
	 * Rate field in *Project*
	 *
	 * - **Field Type**: Number
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.rate
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/number
	 */
	rate: prismic.NumberField;
	
	/**
	 * Awards field in *Project*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.awards[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	awards: prismic.GroupField<Simplify<ProjectDocumentDataAwardsItem>>;
	
	/**
	 * Tag group field in *Project*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.tag_group[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	tag_group: prismic.GroupField<Simplify<ProjectDocumentDataTagGroupItem>>;
	
	/**
	 * Framework field in *Project*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.framework
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	framework: prismic.SelectField<"Freelance" | "Perso" | "Rézo zéro" | "Master 2" | "DSAA" | "DEC" | "BTS" | "STD2A">;
	
	/**
	 * Short description field in *Project*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.short_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	short_description: prismic.RichTextField;
	
	/**
	 * Content field in *Project*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Thumbnail field in *Project*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.thumbnail
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	thumbnail: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Date field in *Project*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.date
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	date: prismic.DateField;
	
	/**
	 * Link field in *Project*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.link
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Link label field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.link_label
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	link_label: prismic.KeyTextField;
	
	/**
	 * Medias field in *Project*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.medias[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	medias: prismic.GroupField<Simplify<ProjectDocumentDataMediasItem>>;/**
	 * Meta Description field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: project.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Project*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *Project*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: project.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
}

/**
 * Project document from Prismic
 *
 * - **API ID**: `project`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ProjectDocumentData>, "project", Lang>;

type ProjectListingPageDocumentDataSlicesSlice = never

/**
 * Content for project_listing_page documents
 */
interface ProjectListingPageDocumentData {
	/**
	 * Slice Zone field in *project_listing_page*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_listing_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ProjectListingPageDocumentDataSlicesSlice>;/**
	 * Meta Title field in *project_listing_page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: project_listing_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Meta Description field in *project_listing_page*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: project_listing_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *project_listing_page*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_listing_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * project_listing_page document from Prismic
 *
 * - **API ID**: `project_listing_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectListingPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ProjectListingPageDocumentData>, "project_listing_page", Lang>;

/**
 * Item in *Settings → columns*
 */
export interface SettingsDocumentDataColumnsItem {
	/**
	 * Title field in *Settings → columns*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.columns[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Content field in *Settings → columns*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.columns[].content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Item in *Settings → Socials*
 */
export interface SettingsDocumentDataSocialsItem {
	/**
	 * Social field in *Settings → Socials*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.socials[].social
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	social: prismic.SelectField<"Instagram" | "Facebook" | "Youtube" | "Vimeo" | "TikTok" | "Behance" | "LinkedIn" | "Github">;
	
	/**
	 * Link field in *Settings → Socials*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.socials[].link
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	link: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Label field in *Settings → Socials*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.socials[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
}

/**
 * Content for Settings documents
 */
interface SettingsDocumentData {
	/**
	 * Website name field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.website_name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	website_name: prismic.KeyTextField;
	
	/**
	 * About title field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.about_title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	about_title: prismic.KeyTextField;
	
	/**
	 * About content field in *Settings*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.about_content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	about_content: prismic.RichTextField;
	
	/**
	 * Email field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.email
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	email: prismic.KeyTextField;
	
	/**
	 * Display all projects field in *Settings*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: settings.display_all_projects
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	display_all_projects: prismic.BooleanField;
	
	/**
	 * columns field in *Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.columns[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	columns: prismic.GroupField<Simplify<SettingsDocumentDataColumnsItem>>;/**
	 * Meta Description field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A brief summary of the page
	 * - **API ID Path**: settings.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Meta Image field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
	
	/**
	 * Meta Title field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: A title of the page used for social media and search engines
	 * - **API ID Path**: settings.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;/**
	 * Name field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.publisher_name
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	publisher_name: prismic.KeyTextField;
	
	/**
	 * URL field in *Settings*
	 *
	 * - **Field Type**: Link
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.publisher_url
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/link
	 */
	publisher_url: prismic.LinkField<string, string, unknown, prismic.FieldState, never>;
	
	/**
	 * Image field in *Settings*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.publisher_image
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	publisher_image: prismic.ImageField<never>;
	
	/**
	 * Job title field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.publisher_job_title
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	publisher_job_title: prismic.KeyTextField;
	
	/**
	 * Works for field in *Settings*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.publisher_work_for
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	publisher_work_for: prismic.KeyTextField;
	
	/**
	 * Socials field in *Settings*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.socials[]
	 * - **Tab**: Publisher
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	socials: prismic.GroupField<Simplify<SettingsDocumentDataSocialsItem>>;
}

/**
 * Settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingsDocumentData>, "settings", Lang>;

export type AllDocumentTypes = AboutDocument | ArchiveDocument | HomePageDocument | MenuDocument | ProjectDocument | ProjectListingPageDocument | SettingsDocument;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			AboutDocument,
			AboutDocumentData,
			AboutDocumentDataSlicesSlice,
			AboutDocumentDataFormationsItem,
			AboutDocumentDataExperiencesItem,
			ArchiveDocument,
			ArchiveDocumentData,
			ArchiveDocumentDataSlicesSlice,
			HomePageDocument,
			HomePageDocumentData,
			MenuDocument,
			MenuDocumentData,
			ProjectDocument,
			ProjectDocumentData,
			ProjectDocumentDataAwardsItem,
			ProjectDocumentDataTagGroupItem,
			ProjectDocumentDataMediasItem,
			ProjectListingPageDocument,
			ProjectListingPageDocumentData,
			ProjectListingPageDocumentDataSlicesSlice,
			SettingsDocument,
			SettingsDocumentData,
			SettingsDocumentDataColumnsItem,
			SettingsDocumentDataSocialsItem,
			AllDocumentTypes
		}
	}
}