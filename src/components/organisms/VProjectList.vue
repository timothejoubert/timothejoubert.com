<template>
    <nav v-if="filteredProjects.length" class="container" :class="$style.root">
        <ul :class="$style.projects" :style="columns && { '--card-number': columns }">
            <li v-for="(project, index) in projects" :key="index + project.uid">
                <v-project-card :project="project" :active-projects-id="activeProjectsId" />
            </li>
        </ul>
    </nav>
    <v-no-result v-else @reset-filter="onResetFilterClick" />
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectDocument, ProjectDocumentDataTagsItem } from '~~/prismicio-types'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VProjectList',
    data() {
        return {
            columns: null as null | string,
        }
    },
    computed: {
        projects(): ProjectDocument[] {
            return this.$store.getters.mainProjects as ProjectDocument[]
        },
        activeProjectsId(): string[] {
            const tags = this.$store.state.tagFilters as string[]
            if (!tags.length) return []

            return this.projects
                .filter((project) => {
                    const projectTags = this.$store.getters.getTagUidByProject(project)
                    return !tags.some((tag) => projectTags.includes(tag))
                })
                .map((filteredProject) => filteredProject.uid)
        },
        filteredProjects(): ProjectDocument[] {
            const frameworks = this.$store.state.frameWorkFilters
            const tags = this.$store.state.tagFilters

            if (!frameworks.length && !tags.length) {
                return this.projects
            } else if (frameworks.length && !tags.length) {
                return this.getProjectByFrameworks(this.projects, frameworks)
            } else if (!frameworks.length && tags.length) {
                return this.getProjectByTags(this.projects, tags)
            } else {
                const filteredFrameworkProjects = this.getProjectByFrameworks(this.projects, frameworks)
                return this.getProjectByTags(filteredFrameworkProjects, tags)
            }
        },
    },
    watch: {
        '$store.state.uiColumns'(value: string) {
            this.columns = value
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
                    (tagReference: ProjectDocumentDataTagsItem) => (tagReference.tag as { uid?: string }).uid || ''
                )
                return projectTags.some((tag) => tags.includes(tag))
            })
        },
        onResetFilterClick() {
            this.$store.commit(MutationType.TAG_FILTERS, [])
            this.$store.commit(MutationType.UI_COLUMNS, '4')
            this.$store.commit(MutationType.FRAMEWORK_FILTERS, [])
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    padding-bottom: rem(30);
}

.projects {
    --card-number: 1;

    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(var(--card-number), minmax(0, 1fr));

    @include media('>=xs') {
        --card-number: 2;
    }

    @include media('>=lg') {
        --card-number: 4;
    }

    @include media('>=hd') {
        --card-number: 5;
    }
}
</style>
