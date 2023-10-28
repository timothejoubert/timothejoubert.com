<template>
    <v-link
        v-if="project"
        :reference="project"
        :class="$style.root"
        @mouseenter.native="hovered = true"
        @mouseleave.native="hovered = false"
    >
        <h3 :class="$style.title">{{ project.data.title }}</h3>
        <v-button v-for="tag in tags" :key="tag.id" tag="div" size="xs" outlined theme="dark" :label="tag.label" />
        <v-button
            animate
            :play-animation="hovered"
            size="s"
            theme="dark"
            filled
            :class="$style.cta"
            label="Voir le projet"
        />
    </v-link>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectDocument } from '~~/prismicio-types'
import getTagsByProject from '~/utils/tags'
import type { Tag } from '~/utils/tags'

export default Vue.extend({
    name: 'VNextProject',
    data() {
        return {
            hovered: false,
        }
    },
    computed: {
        project(): ProjectDocument | undefined {
            return this.$store.getters.getNextProjectInQueue
        },
        tags(): Tag[] | undefined {
            return this.project && getTagsByProject(this.project)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: rem(20);
    background-color: color-mix(in sRGB, var(--theme-foreground-color) 5%, transparent);
    border-radius: rem(4) rem(50) rem(4) rem(4);
    gap: rem(12) rem(8);
}

.title {
    position: relative;
    width: 100%;
    flex-grow: 1;
}

.tags {
    display: flex;
    width: 100%;
    gap: rem(10);
}

.cta {
    margin-left: auto;
}
</style>
