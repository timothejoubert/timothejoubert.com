import { getProjectYear } from '~/utils/date'
import type { ProjectPageDocument } from '~/prismicio-types'

export function getCardProjectProps(project: ProjectPageDocument) {
    const { main_media, title, creation_date, excerpt } = project.data

    return {
        id: project.id,
        image: main_media,
        title,
        description: excerpt,
        tags: parseProjectTags(project.tags),
        date: getProjectYear(creation_date),
    }
}

const validProjectTags = ['project', 'projects', 'projet', 'projets']
export function parseProjectTags(tags: string[]) {
    return tags
        .filter((tag) => {
            const label = tag.toLowerCase()
            return validProjectTags.some(validProjectTag => label.includes(validProjectTag))
        })
        .map((tag) => {
            const filteredTag = tag.substring(tag.indexOf(':') + 1)
            return filteredTag.trim()
        })
}
