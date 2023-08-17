// utils functions for filter projets that have some tag and framework

// import { ProjectDocument } from '~~/prismicio-types'
//
// const filteredProjects = (): ProjectDocument[] => {
//     const frameworks = this.$store.state.frameWorkFilters
//     const tags = this.$store.state.tagFilters
//
//     if (!frameworks.length && !tags.length) {
//         return this.projects
//     } else if (frameworks.length && !tags.length) {
//         return this.getProjectByFrameworks(this.projects, frameworks)
//     } else if (!frameworks.length && tags.length) {
//         return this.getProjectByTags(this.projects, tags)
//     } else {
//         const filteredFrameworkProjects = this.getProjectByFrameworks(this.projects, frameworks)
//         return this.getProjectByTags(filteredFrameworkProjects, tags)
//     }
// }
//
// const getProjectByFrameworks = (projects: ProjectDocument[], frameworks: string[]): ProjectDocument[] => {
//     return projects.filter((project) => {
//         const projectFramework = (project.data.framework as { uid?: string })?.uid || ''
//         return frameworks.includes(projectFramework)
//     })
// }
// const getProjectByTags = (projects: ProjectDocument[], tags: string[]): ProjectDocument[] => {
//     return projects.filter((project) => {
//         const projectTags = project.data.tags.map(
//             (tagReference: ProjectDocumentDataTagsItem) => (tagReference.tag as { uid?: string }).uid || ''
//         )
//         return projectTags.some((tag) => tags.includes(tag))
//     })
// }
