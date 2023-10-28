<template>
    <nav v-if="projects.length" class="container" :class="$style.root">
        <ul :class="$style.projects" :style="columns && { '--card-number': columns }">
            <li v-for="project in projects" :id="project.uid" :key="project.uid" @click="updateProjectQueue">
                <v-project-card :project="project" :active-projects-id="activeProjectsId" />
            </li>
        </ul>
    </nav>
    <v-no-result v-else @reset-filter="onResetFilterClick" />
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectDocument } from '~~/prismicio-types'
import MutationType from '~/constants/mutation-type'
import getTagsByProject, { Tag } from '~/utils/tags'
import AppConst from '~/constants/app'

export default Vue.extend({
    name: 'VFavoriteProjectList',
    data() {
        return {
            columns: null as null | string,
        }
    },
    computed: {
        projects(): ProjectDocument[] {
            if (this.$store.state.isEveryProjectInFavorite) return this.$store.getters.projects as ProjectDocument[]
            return this.$store.getters.highlightedProjects as ProjectDocument[]
        },
        activeProjectsId(): string[] {
            const selectedTags = this.$store.state.tagFilters as string[]
            if (!selectedTags.length) return []

            const projectWithSelectedTag = this.projects.filter((project) => {
                const projectTags = getTagsByProject(project)
                return projectTags.some(({ id }: Tag) => selectedTags.includes(id))
            })

            return projectWithSelectedTag.map((filteredProject) => filteredProject.uid)
        },
    },
    watch: {
        '$store.state.uiColumns'(value: string) {
            this.columns = value
        },
        '$store.state.tagFilters'() {
            this.updateProjectQueue()
        },
    },
    methods: {
        updateProjectQueue() {
            const activeUidList = this.activeProjectsId.length ? this.activeProjectsId : this.projects.map((p) => p.uid)
            this.$store.commit(MutationType.PROJECT_QUEUE_LIST, activeUidList)
        },
        onResetFilterClick() {
            this.$store.commit(MutationType.TAG_FILTERS, [])
            this.$store.commit(MutationType.UI_COLUMNS, AppConst.UI_COLUMNS)
            this.$store.commit(MutationType.FRAMEWORK_FILTERS, [])
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    padding-bottom: rem(30);

    @include media('>=lg') {
        padding-bottom: $v-about-toggle-height;
    }
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
        --card-number: 3;
    }

    @include media('>=xxl') {
        --card-number: 4;
    }

    @include media('>=hd') {
        --card-number: 5;
    }
}
</style>
