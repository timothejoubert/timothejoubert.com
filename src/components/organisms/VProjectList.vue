<template>
    <nav class="container" :class="$style.root">
        <ul :class="$style.projects" :style="{ '--card-number': columns }">
            <li v-for="(project, index) in filteredProjects" :key="index + project.uid">
                <v-project-card :project="project" />
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectDocument } from '~~/prismicio-types'

export default Vue.extend({
    name: 'VProjectList',
    computed: {
        projects(): ProjectDocument[] {
            return this.$store.getters.projects as ProjectDocument[]
        },
        filteredProjects(): ProjectDocument[] {
            const projects = this.$store.getters.projects as ProjectDocument[]
            const frameworks = this.$store.state.frameWorkFilters
            const tags = this.$store.state.tagFilters

            if (!frameworks.length && !tags.length) {
                return projects
            } else if (frameworks.length && !tags.length) {
                return this.getProjectByFrameworks(this.projects, frameworks)
            } else if (!frameworks.length && tags.length) {
                return this.getProjectByTags(this.projects, tags)
            } else {
                const filteredFrameworkProjects = this.getProjectByFrameworks(this.projects, frameworks)
                return this.getProjectByTags(filteredFrameworkProjects, tags)
            }
        },
        columns() {
            return this.$store.state.uiColumns
        },
    },
    methods: {
        getProjectByFrameworks(projects: ProjectDocument[], frameworks: string[]): ProjectDocument[] {
            return projects.filter((project) => {
                const projectFramework = (project.data.framework as { uid?: string })?.uid || ''
                return frameworks.includes(projectFramework)
            })
        },
        getProjectByTags(projects: ProjectDocument[], tags: string[]): ProjectDocument[] {
            return projects.filter((project) => {
                const projectTags = project.data.tags.map(
                    (tagReference) => (tagReference.tag as { uid?: string }).uid || ''
                )
                return projectTags.some((tag) => tags.includes(tag))
            })
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    margin-top: rem(30);
}

.projects {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(var(--card-number, 4), minmax(0, 1fr));
}
</style>
