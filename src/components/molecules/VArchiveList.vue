<template>
    <ul v-if="hasProject" :class="rootClasses">
        <li v-for="project in filteredProjects" :key="project.uid">
            <v-link
                :reference="project"
                :class="$style.link"
                @mouseenter.native="onMouseEnter"
                @mouseleave.native="onMouseLeave"
            >
                <v-new-pill :date="project.data.date" :class="$style.new" />
                <v-project-parsed v-slot="p" :project="project.data">
                    <div :class="[$style.title, sortId === 'title' && $style['title--highlight']]">
                        {{ project.data.title }}
                    </div>
                    <span v-if="p.date" :class="[$style.date, sortId === 'date' && $style['title--highlight']]">{{
                        p.date
                    }}</span>
                    <span :class="[$style.framework, sortId === 'framework' && $style['title--highlight']]">{{
                        p.framework
                    }}</span>
                    <div :class="[$style.tags, sortId === 'tag_group' && $style['title--highlight']]">
                        <span v-for="tag in p.tags" :key="tag.uid" :class="$style.tag">{{ tag.label }}</span>
                    </div>
                    <v-rate :rate="p.rate" :class="[$style.rate, sortId === 'rate' && $style['title--highlight']]" />
                    <arrow-icon :class="$style.icon" />
                </v-project-parsed>
            </v-link>
        </li>
    </ul>
    <v-no-result
        v-else
        :class="$style['no-result']"
        button-label="Effacer la recherche"
        @reset-filter="$emit('clearSearch')"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { ProjectDocument, ProjectDocumentDataTagGroupItem } from '~~/prismicio-types'
import { ProjectDocumentData } from '~/types/prismic/app-prismic'
import ArrowIcon from '~/assets/images/icons/arrow-up-right.svg?sprite'

export default Vue.extend({
    name: 'VArchiveList',
    components: { ArrowIcon },
    props: {
        sortOrder: String as PropType<'ASC' | 'DESC'>,
        sortId: String as PropType<keyof ProjectDocumentData>,
        search: String,
    },
    data() {
        return {
            hasKeyUpListener: false,
        }
    },
    computed: {
        rootClasses(): (undefined | string | false)[] {
            return [
                this.$style.root,
                !this.hasProject && this.$style['root--empty'],
                this.$store.getters.isProjectOpen && this.$style['root--project-open'],
            ]
        },
        hasProject(): boolean {
            return !!this.filteredProjects.length
        },
        sortedProjects(): ProjectDocument[] {
            const projects = (this.$store.getters.projects as ProjectDocument[]).slice()
            let projectSorted

            const sortedDataType = typeof projects[0]?.data?.[this.sortId]
            if (sortedDataType === 'number') {
                // rate
                projectSorted = projects.sort(
                    (p1, p2) => (p2.data[this.sortId] as number) - (p1.data[this.sortId] as number)
                )
            } else if (this.sortId === 'date') {
                projectSorted = projects.sort(
                    (p1, p2) => parseInt(p2.data?.date || '0') - parseInt(p1.data?.date || '0')
                )
            } else if (sortedDataType === 'string') {
                // title || framework
                projectSorted = projects.sort((p1: ProjectDocument, p2: ProjectDocument) => {
                    const title1 = p1.data[this.sortId] || ''
                    const title2 = p2.data[this.sortId] || ''
                    return title1 < title2 ? -1 : title1 > title2 ? 1 : 0
                })
            } else if (this.sortId === 'tag_group') {
                projectSorted = projects.sort((p1, p2) => {
                    const p1TagsString = p1.data.tag_group
                        .map((group: ProjectDocumentDataTagGroupItem) => group.tag)
                        .join('')
                    const p2TagsString = p2.data.tag_group
                        .map((group: ProjectDocumentDataTagGroupItem) => group.tag)
                        .join('')

                    if (p1TagsString < p2TagsString) return -1
                    else if (p1TagsString > p2TagsString) return 1
                    else return 0
                })
            } else {
                projectSorted = projects
            }

            return this.sortOrder === 'DESC' ? projectSorted.reverse() : projectSorted
        },
        filteredProjects(): ProjectDocument[] {
            if (!this.search.length) return this.sortedProjects

            return this.sortedProjects.filter(({ data }: ProjectDocument) => {
                return data.title && data.title.toLowerCase().includes(this.search.toLowerCase())
            })
        },
    },
    watch: {
        filteredProjects(projects: ProjectDocument[]) {
            if (projects.length === 1 && !this.hasKeyUpListener) {
                this.hasKeyUpListener = true
                window.addEventListener('keyup', this.onKeyUp)
            } else if (this.hasKeyUpListener) {
                this.hasKeyUpListener = false
                window.removeEventListener('keyup', this.onKeyUp)
            }
        },
    },
    beforeDestroy() {
        window.removeEventListener('keyup', this.onKeyUp)
    },
    methods: {
        onKeyUp(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                const selectedProjectUid = this.filteredProjects[0].uid
                this.$router.push('/' + selectedProjectUid)
            }
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
.root {
    min-height: rem(500);
}

.no-result {
    --v-no-result-min-height: #{rem(500)};

    border-top: 1px solid var(--theme-foreground-color);
}

.link {
    position: relative;
    display: flex;
    overflow: hidden;
    align-items: center;
    padding-right: rem(6);
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

    @media (hover: hover) {
        &:hover {
            color: var(--theme-background-color);
        }

        &:hover::before {
            translate: 0 0 !important;
        }
    }
}

.title,
.date,
.framework,
.tags,
.rate {
    overflow: hidden;
    opacity: 0.6;
    text-overflow: ellipsis;
    transition: opacity 0.4s, max-width 0.4s;

    .root--project-open & {
        @include column-stretch;
    }

    &--highlight {
        opacity: 1;
    }

    @media (hover: hover) {
        .link:hover & {
            opacity: 1;
        }
    }
}

.new {
    --v-new-pill-width: 36px;
    --v-new-pill-transform: translate(-100%, 0);
    --v-new-pill-weight: 450;
    --v-new-pill-font-size: #{rem(13)};

    position: absolute;
    right: 0;
}

.title {
    position: relative;
    width: rem(160);

    .root--project-open & {
        @include column-stretch($expand: true);
    }
}

.date {
    width: rem(70);
}

.framework {
    width: rem(100);
}

.tags {
    display: flex;
    max-width: rem(550);
    flex-grow: 1;
}

.rate {
    min-width: rem(120);
}

.tag {
    .root--project-open &:not(:first-child) {
        display: none;
    }

    &:first-child {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &:not(:last-child)::after {
        position: relative;
        content: '|';
        margin-inline: rem(8);
    }
}

.icon {
    flex-shrink: 0;
    margin-left: auto;
}
</style>
