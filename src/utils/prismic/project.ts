import { getTags } from '~/utils/tags'
import { ProjectDocument } from '~~/prismicio-types'
import { PrismicRichText } from '~/types/app'

interface PrismicMedia {
    link_type: string
    name?: string
    kind?: string
    url?: string
    size?: string
    height?: string | null
    width?: string | null
}

interface Award {
    name?: string
    type?: string
    url?: string
}

interface FormattedProject {
    id: string
    slug: string
    publication: { creation: string; last_update: string }
    endpoint: string
    favorite: boolean
    title: string | null
    date: string | null
    excerpt: { text: string | undefined; richText: PrismicRichText }
    content: { text: string | undefined; richText: PrismicRichText }
    externalLink: string | undefined
    tag: { id: string; label: string }[]
    framework: string | null
    rate: number | null
    thumbnail: PrismicMedia
    medias: PrismicMedia[] | null
    awards: Award[] | undefined | null
}

function richTextToString(content: unknown): string | undefined {
    if (typeof content === 'string') return content
    else if (Array.isArray(content)) {
        return content?.map((markdownContent) => (markdownContent as { text?: string })?.text)?.join(' ')
    } else if ((content as any)?.text) {
        return (content as any).text
    }
}

export function getFormattedBackupProjects(projects: ProjectDocument[]): FormattedProject[] {
    return projects.map((project) => {
        const { data, uid, id, href } = project
        const { title, date, favorite, framework, rate, link, content, short_description, thumbnail, medias, awards } =
            data

        return {
            id,
            title,
            slug: uid,
            favorite,
            date,
            thumbnail: thumbnail as unknown as PrismicMedia,
            excerpt: { text: richTextToString(short_description), richText: short_description },
            tag: getTags(data),
            framework,
            rate,
            content: { text: richTextToString(content), richText: content },
            externalLink: (link as { url?: string })?.url,
            medias: medias.filter((el) => (el.media as { url?: string })?.url).map(({ media }) => media),
            awards: awards
                ?.filter((award) => award.name || (award.link as { url?: string })?.url)
                .map(({ link, name, type }) => {
                    return { name, type, url: (link as { url?: string })?.url } as Award
                }),
            publication: {
                creation: project.first_publication_date,
                last_update: project.last_publication_date,
            },
            endpoint: href,
        }
    })
}
