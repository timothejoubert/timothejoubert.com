<template>
    <nav v-if="filteredProjects.length" class="container" :class="$style.root">
        <ul :class="$style.projects" :style="{ '--card-number': columns }">
            <li v-for="(project, index) in filteredProjects" :key="index + project.uid">
                <v-project-card :project="project" />
            </li>
        </ul>
    </nav>
    <div v-else :class="[$style['no-result'], !$store.state.isSettingsOpen && $style['no-result--extend']]">
        <div :class="$style.word" class="text-h1">
            <v-split-letters content="Oups..." tag="span" />
        </div>
        <div :class="$style.message">Aucun résultats</div>
        <v-button size="m" label="Reset tous les filtres" filled @click="onClick" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectDocument, ProjectDocumentDataTagsItem } from '~~/prismicio-types'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VProjectList',
    computed: {
        projects(): ProjectDocument[] {
            return this.$store.getters.projects as ProjectDocument[]
        },
        filteredProjects(): ProjectDocument[] {
            const projects = (this.$store.getters.projects as ProjectDocument[]).slice().filter((project) => {
                if (this.$store.state.allProjectDisplayed) return true
                else return project.data.favorite
            })
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
                    (tagReference: ProjectDocumentDataTagsItem) => (tagReference.tag as { uid?: string }).uid || ''
                )
                return projectTags.some((tag) => tags.includes(tag))
            })
        },
        onClick() {
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
    margin-top: rem(30);
}

.projects {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(var(--card-number, 4), minmax(0, 1fr));
}

.no-result {
    display: flex;
    min-height: calc(100vh - $v-top-bar-height - $v-about-toggle-height - $v-settings-height);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: min-height 0.4s ease(out-quad);

    &--extend {
        min-height: calc(100vh - $v-top-bar-height - $v-about-toggle-height);
    }
}

.word {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: rem(4);
    opacity: 0.1;
    :global(.split-word-letter) {
        animation: wave-font 1s calc(var(--letter-index) * 100ms - 2s) ease(out-quad) alternate infinite;
    }
}

.message {
    margin-bottom: rem(70);
    opacity: 0.6;
}

@keyframes wave-font {
    from {
        font-variation-settings: 'wght' 100, 'ital' 0;
    }
    to {
        font-variation-settings: 'wght' 900, 'ital' 4;
    }
}
</style>
