import { Document } from '@prismicio/client/types/documents'
import {
    ProjectDocument,
    ProjectDocumentData,
    ProjectDocumentDataAwardsItem,
    SettingsDocument,
} from '~~/prismicio-types'
import { getProjectYear } from '~/utils/prismic/date'
import CustomType from '~/constants/custom-type'
import { slugify } from '~/utils/utils'
import { getTags } from '~/utils/tags'
import { TagLabel } from '~/types/prismic/app-prismic'
import { getAwards } from '~/components/molecules/VProjectParsed.vue'
import { getTextFieldContent } from '~/components/atoms/VText.vue'
import { getSocialsData, SocialsContent } from '~/components/atoms/VSocialList.vue'

interface JsonLdOptions {
    siteName: string
    baseUrl: string
    document: Document
    websiteSettings: SettingsDocument
}

type JsonLdContent = Record<string, unknown>

function getWebsiteCreatorInfo(websiteSettings?: SettingsDocument): JsonLdContent {
    const socials = getSocialsData(websiteSettings?.data?.socials).map((social: SocialsContent) => social.url)

    const result = {
        givenName: 'Timothé',
        familyName: 'Joubert',
        birthDate: '1998-08-24',
        url: 'https://timothejoubert.com',
    }

    if (socials.length) Object.assign(result, { sameAs: socials })

    return result
}

function getJsonLdProjectInfos(project: ProjectDocumentData) {
    const projectContent: JsonLdContent = {}

    if (project.title) projectContent.name = project.title

    const externalUrl = (project.link as { url?: string })?.url
    if (externalUrl) projectContent.url = externalUrl

    const media = (project.thumbnail as { url?: string })?.url
    if (media) projectContent.thumbnailUrl = media

    if (project.content || project.short_description) {
        projectContent.description =
            getTextFieldContent(project.short_description) || getTextFieldContent(project.content)
    }

    if (project.date) projectContent.copyrightYear = getProjectYear(project.date)

    const awards = getAwards(project)
    if (awards?.length)
        projectContent.award = awards.reduce(
            (acc: string, current: ProjectDocumentDataAwardsItem) => (acc += current.name),
            ''
        )

    const tags = getProjectTags(project)

    return {
        artform: getProjectArtForm(tags), // 'Video'
        keywords: tags.join(', '),
        // artMedium: getProjectMedium(tags),
        ...projectContent,
    }
}

const DIGITAL_MEDIUMS: TagLabel[] = ['Développement', 'Code créatif']
const PRINT_MEDIUMS: TagLabel[] = ['Illustration', 'Édition']
const IDENTITY_MEDIUMS: TagLabel[] = ['Typographie', "Design d'interface", 'Identité visuelle', 'Motion design']
const ART_MEDIUMS: TagLabel[] = ['Expression plastique']

function getProjectArtForm(tags: TagLabel[]) {
    if (tags.some((tag) => DIGITAL_MEDIUMS.includes(tag))) return 'Digital'
    else if (tags.some((tag) => PRINT_MEDIUMS.includes(tag))) return 'Print'
    else if (tags.some((tag) => IDENTITY_MEDIUMS.includes(tag))) return 'Visual identity'
    else if (tags.some((tag) => ART_MEDIUMS.includes(tag))) return 'Art'
    else return 'CreativeWork'
}

function getProjectTags(project: ProjectDocumentData) {
    return getTags(project).map((tag) => tag.label) as TagLabel[]
}

function getJsonLdProject(document: Document, creator: JsonLdContent) {
    // const tags = getProjectTags(document.data as ProjectDocumentData)
    // const isDev = getProjectArtForm(tags) === 'Digital'
    const type = 'CreativeWork' // isDev ? 'WebSite' : 'CreativeWork'

    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        mainEntity: {
            '@id': document.uid,
            '@type': type,
            ...getJsonLdProjectInfos(document.data as ProjectDocumentData),
            creator,
        },
    }
}

export function getJsonLdData({ document, siteName, baseUrl, websiteSettings }: JsonLdOptions) {
    const websiteInformation = {
        name: siteName,
        alternateName: slugify(siteName),
        url: baseUrl,
        jobTitle: 'Développeur Front-end et Designer graphique',
        description: 'Portfolio du design graphique et développeur Timothé joubert basé à Lyon',
    }

    if (document.type === CustomType.HOME_PAGE) {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': '/#site',
            ...websiteInformation,
            author: {
                '@type': 'Person',
                ...getWebsiteCreatorInfo(websiteSettings),
            },
        }
    } else if (document.type === CustomType.PROJECT) {
        return getJsonLdProject(document, {
            '@type': 'Person',
            ...getWebsiteCreatorInfo(websiteSettings),
        })
    } else {
        return undefined
    }
}

export function getJsonLdProjectList(projects: ProjectDocument[]) {
    return projects.map((project) => {
        const id =
            project.type === CustomType.PROJECT ? `Case study: ${project.type} ${project.uid}` : `Page ${project.uid}`
        return {
            '@type': 'WebPage',
            '@id': id,
            title: project.data.title,
            url: '/' + project.uid,
        }
    })
}
