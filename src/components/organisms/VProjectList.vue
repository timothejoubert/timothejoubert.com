<template>
    <nav class="container" :class="$style.root">
        <ul :class="$style.projects">
            <li v-for="(project, index) in projects" :key="index + project.uid">
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
            return [...Array(20).keys()].map(() => this.$store.getters.projects[0])
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
    grid-template-columns: repeat(var(--card-number, 4), minmax(150px, 1fr));
}
</style>
