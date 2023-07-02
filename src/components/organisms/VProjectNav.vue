<template>
    <nav class="container">
        <ul :class="$style.projects">
            <li v-for="project in projects" :key="project.uid">
                <v-project-card :project="project" />
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectDocument } from '~~/prismicio-types'

export default Vue.extend({
    name: 'VProjectNav',
    computed: {
        projects(): ProjectDocument[] {
            return [...Array(10).keys()].map(() => this.$store.state.projects[0])
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
}

.projects {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(var(--card-number, 4), 1fr);
}
</style>
