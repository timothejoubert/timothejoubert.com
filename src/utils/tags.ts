import { ProjectDocument, ProjectDocumentData } from '~~/prismicio-types'
import { slugify } from '~/utils/utils'

export interface Tag {
    id: string
    label: string
}

export function formatTag(tag: string): Tag {
    return {
        id: slugify(tag),
        label: tag,
    }
}

export function getTags(projectData: ProjectDocumentData): Tag[] {
    return projectData.tag_group
        ?.filter((group) => {
            return !!group.tag
        })
        .map((group) => {
            return formatTag(group.tag as string)
        })
}

export default function getTagsByProject(project: ProjectDocument): Tag[] {
    return getTags(project.data)
}
