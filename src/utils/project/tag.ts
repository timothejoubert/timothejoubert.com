import { ProjectDocument, ProjectDocumentDataTagsItem, ProjectTagDocument } from '~~/prismicio-types'
import { ProjectDocumentData } from '~/types/prismic/app-prismic'

export function getAllTagProject(projects: ProjectDocument[] | undefined): string[] {
    return (
        projects
            ?.filter((project: ProjectDocument) => !!project?.data?.tags?.length)
            .map(({ data }: ProjectDocument) => getProjectTags(data))
            .flat(2) || []
    )
}

export function getProjectDocumentTags(project: ProjectDocument): string[] {
    return getProjectTags(project.data)
}

export function getProjectTags(projectData: ProjectDocumentData): string[] {
    const filteredTags = projectData.tags?.filter((tag) => !!(tag as { label?: string })?.label) as unknown as {
        label: string
    }[]
    return filteredTags.map((tag) => tag.label)
}

export function getTagsByReference(tags: ProjectDocumentDataTagsItem[], tagDocuments: ProjectTagDocument[]): string[] {
    return (
        (tags
            ?.map((tagReference) => {
                const uid = (tagReference.tag as { uid?: string })?.uid
                return tagDocuments.filter((projectTag: ProjectTagDocument) => projectTag.uid === uid)?.[0]?.data?.name
            })
            .filter((tag) => !!tag) as string[]) || []
    )
}
