<template>
    <ul :class="$style.list">
        <li v-for="(project, i) in sortedProjects" :key="i">
            <v-link
                :reference="project"
                :class="$style.link"
                @mouseenter.native="onMouseEnter"
                @mouseleave.native="onMouseLeave"
            >
                <v-project-parsed v-slot="p" :project="project.data">
                    <div :class="$style.title">
                        {{ project.data.title }}
                    </div>
                    <span v-if="p.date" :class="$style.date">{{ p.date }}</span>
                    <span :class="$style.framework">{{ p.framework }}</span>
                    <div :class="$style.tags">
                        <span v-for="tag in p.tags" :key="tag.uid" :class="$style.tag">{{ tag.label }}</span>
                    </div>
                    <div :class="$style.arrow"></div>
                </v-project-parsed>
            </v-link>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { ProjectDocument } from '~~/prismicio-types'
import { ProjectDocumentData } from '~/types/prismic/app-prismic'
import { getProjectYear } from '~/utils/prismic/date'

export default Vue.extend({
    name: 'VArchiveList',
    props: {
        sortOrder: String as PropType<'ASC' | 'DESC'>,
        sortId: String as PropType<keyof ProjectDocumentData>,
    },
    computed: {
        projects(): ProjectDocument[] {
            return (this.$store.getters.projects as ProjectDocument[]).slice()
        },
        sortedProjects(): ProjectDocument[] {
            const projects = this.projects
            let projectSorted
            const sortType = typeof projects[0].data?.[this.sortId]

            if (sortType === 'undefined') projectSorted = projects
            else if (this.sortId === 'date') {
                projectSorted = projects.sort((p1, p2) => getProjectYear(p1.data?.date) + getProjectYear(p2.data?.date))
            } else if (this.sortId === 'title') {
                projectSorted = this.SortByDataAlphabetically('title')
            } else if (this.sortId === 'framework') {
                projectSorted = projects.sort(
                    (projectA, projectB) => projectA.data.framework?.uid + projectB.data.framework?.uid
                )
            } else {
                projectSorted = projects
            }

            return this.sortOrder === 'ASC' ? projectSorted : projectSorted.reverse()
        },
    },
    methods: {
        SortByDataAlphabetically(projectData: keyof ProjectDocumentData) {
            return this.projects.sort((p1: ProjectDocument, p2: ProjectDocument) => {
                const title1 = p1.data[projectData] || ''
                const title2 = p2.data[projectData] || ''
                return title1 < title2 ? -1 : title1 > title2 ? 1 : 0
            })
        },
        onMouseEnter(event: MouseEvent) {
            const el = event.target as HTMLElement

            if (this.getDirection(el, event.y) === 'bottom') {
                el.style.setProperty('--panel-translate-y', '-100%')
            } else {
                el.style.setProperty('--panel-translate-y', '100%')
            }
        },
        onMouseLeave(event: MouseEvent) {
            const el = event.target as HTMLElement

            if (this.getDirection(el, event.y) === 'bottom') {
                el.style.setProperty('--panel-translate-y', '100%')
            } else {
                el.style.setProperty('--panel-translate-y', '-100%')
            }
        },
        getDirection(el: HTMLElement, mouseY: number) {
            const middle = el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2

            return mouseY < middle ? 'top' : 'bottom'
        },
    },
})
</script>

<style lang="scss" module>
.list {
    position: relative;
}

.link {
    position: relative;
    display: flex;
    overflow: hidden;
    align-items: center;
    border-top: 1px solid var(--theme-foreground-color);
    gap: rem(36);
    isolation: isolate;
    padding-block: rem(10);
    transition: 0.4s ease(out-quad);
    transition-property: opacity, color;
    white-space: nowrap;

    &::before {
        position: absolute;
        z-index: -3;
        background-color: var(--theme-foreground-color);
        content: '';
        inset: 0;
        transition: translate 0.4s ease(out-quad);
        translate: 0 var(--panel-translate-y, -100%);
    }

    &:hover {
        color: var(--theme-background-color);
    }

    &:hover::before {
        translate: 0 0 !important;
    }

    & > *:not(.title) {
        opacity: 0.6;
        transition: opacity 0.4s;
    }

    &:hover > *:not(.title) {
        opacity: 1;
    }
}

.title {
    position: relative;
    overflow: hidden;
    width: rem(160);
    text-overflow: ellipsis;

    //&::after {
    //    position: absolute;
    //    background: linear-gradient(to right, transparent 70%, var(--theme-background-color) 100%);
    //    content: '';
    //    inset: 0;
    //    transition: background 0.4s ease(out-quad);
    //}
}

.date {
    width: rem(70);
}

.framework {
    width: clamp(15%, rem(50), rem(400));
    //flex: 30% rem(100) 1; // [max] [min] [ideal size];
}

.tags {
    display: flex;
    flex-grow: 1;
}

.tag {
    &:not(:last-child)::after {
        position: relative;
        content: '|';
        margin-inline: rem(8);
    }
}

.arrow {
    display: flex;
    width: rem(18);
    height: rem(18);
    align-items: center;
    align-self: flex-end;
    justify-content: center;
    margin-left: auto;
    background-color: var(--theme-foreground-color);

    &::before,
    &::after {
        position: absolute;
        content: '';
    }
}
</style>
