import { ProjectDocument } from '~~/prismicio-types'
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
    return projectData.tags?.filter((tag) => !!tag?.label).map(({ label }) => label as string)
}
