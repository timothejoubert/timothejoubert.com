<template>
    <ul :class="$style.list">
        <li v-for="(project, i) in projects" :key="i">
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
                    <span v-if="p.date">{{ p.date }}</span>
                    <span :class="$style.framework">{{ p.framework }}</span>
                    <div :class="$style.tags">
                        <span v-for="tag in p.tags" :key="tag" :class="$style.tag">{{ tag }}</span>
                    </div>
                    <div :class="$style.arrow"></div>
                </v-project-parsed>
            </v-link>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectDocument } from '~~/prismicio-types'

export default Vue.extend({
    name: 'VArchiveList',
    computed: {
        projects(): ProjectDocument[] {
            return this.$store.getters.projects
        },
    },
    methods: {
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
    transition-property: opacity, padding-inline;
    transition: 0.4s ease(out-quad);
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
        padding-inline: rem(10);
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
