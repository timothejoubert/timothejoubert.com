<template>
    <section :class="rootClasses" class="container">
        <v-interactive-text :class="$style['section-title']" class="text-body-l" :content="'Archives'" />
        <keep-alive>
            <v-archive-list :sort-id="sortId" :sort-order="sortOrder" :search="search" @clearSearch="search = ''">
                <template #top-bar>
                    <div :class="$style['top-bar']">
                        <v-button
                            v-for="button in buttons"
                            :key="button.id"
                            :class="[
                                getSectionClass(button.id, true),
                                sortOrder === 'DESC' && button.id === sortId && $style['button--desc'],
                            ]"
                            :label="button.label"
                            theme="light"
                            :inert="!button.sortable"
                            @click="onButtonClick($event, button.id)"
                        >
                            <template v-if="button.sortable" #icon><div :class="$style.sortable__icon"></div></template>
                        </v-button>
                        <div :class="$style.search">
                            <v-search-input v-model="search" />
                        </div>
                    </div>
                </template>
                <template #project="{ project }">
                    <div :class="getSectionClass('title')">{{ project.title }}</div>
                    <span v-if="project.date" :class="getSectionClass('date')">{{ project.date }}</span>
                    <span :class="getSectionClass('framework')">{{ project.framework }}</span>
                    <div :class="getSectionClass('tag_group')">{{ project.parsedTags }}</div>
                    <v-rate :rate="project.rate" :class="getSectionClass('rate')" />
                    <div :class="$style['link-icon']"><arrow-icon /></div>
                </template>
            </v-archive-list>
        </keep-alive>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import ArrowIcon from '~/assets/images/icons/arrow-up-right.svg?sprite'

const DISPLAYED_INFO = [
    {
        label: 'Nom',
        id: 'title',
    },
    {
        label: 'Date',
        id: 'date',
    },
    {
        label: 'Cadre',
        id: 'framework',
    },
    {
        label: 'Type',
        id: 'tag_group',
    },
    {
        label: 'Fierté',
        id: 'rate',
    },
] as const

type SomeType<T extends { id: string }[]> = { [P in T[number]['id']]: string }
const removeReadonly = <T extends any>(arr: T[] | readonly T[]): T[] => arr as T[]
const nonReadonlyArr = removeReadonly(DISPLAYED_INFO)
type SectionType = keyof SomeType<typeof nonReadonlyArr>

interface ArchiveSetting {
    label: string
    id: string
    sortable?: boolean
}

export default Vue.extend({
    name: 'VArchive',
    components: { ArrowIcon },
    data() {
        return {
            sortId: 'date',
            sortOrder: 'ASC' as 'ASC' | 'DESC',
            search: '',
        }
    },
    computed: {
        rootClasses(): (undefined | string | false)[] {
            return [this.$style.root, this.$store.getters.isProjectOpen && this.$style['root--project-open']]
        },
        buttons(): ArchiveSetting[] {
            return DISPLAYED_INFO.map((info) => {
                return {
                    label: info.label,
                    id: info.id,
                    sortable: true,
                }
            })
        },
    },
    methods: {
        onButtonClick(event: Event, id: string) {
            const targetIsDesc = (event.currentTarget as HTMLElement).classList.contains(this.$style['button--desc'])
            targetIsDesc ? (this.sortOrder = 'ASC') : (this.sortOrder = 'DESC')

            if (this.sortId !== id) this.sortId = id
        },
        getSectionClass(id: string, isButton?: true) {
            return [
                this.$style.item,
                isButton && this.$style['item--button'],
                this.$style[id],
                this.sortId === id && this.$style['item--highlight'],
            ] as ['item', 'item--button' | false, SectionType, false | `item--${SectionType}`]
        },
    },
})
</script>

<style lang="scss" module>
.root {
    margin-block: rem(60) rem(60);

    --v-archive-list-gap: #{rem(32)};

    &--project-open {
        --v-archive-list-gap: #{rem(18)};
        --v-search-input-max-width: #{rem(70)};
    }
}

.section-title {
    margin-bottom: rem(42);
}

.top-bar {
    --v-button-padding: 0;

    display: flex;
    gap: var(--v-archive-list-gap);
    transition: gap 0.4s ease(out-quad);
}

.sortable__icon {
    width: rem(10);
    height: rem(10);
    border-width: 1px 1px 0 0;
    border-style: solid;
    border-color: var(--theme-foreground-color);
    transform: translate(0, rem(-2)) rotate(135deg);
    transform-origin: center;
    transition: transform 0.3s ease(out-quad);

    .button--desc & {
        transform: translate(0, rem(2)) rotate(-45deg);
    }
}

.item {
    overflow: hidden;
    opacity: 0.6;
    text-overflow: ellipsis;
    transition: opacity 0.4s, max-width 0.4s;

    .root--project-open & {
        width: rem(100);
    }

    :global(.nuxt-link-active) &,
    :global(.hovered) &,
    &--highlight {
        opacity: 1;
    }

    @media (hover: hover) {
        .link:hover & {
            opacity: 1;
        }
    }
}

.title {
    position: relative;
    width: rem(160);
    flex-shrink: 0;

    .root--project-open & {
        max-width: rem(100);
    }

    @include media('<md') {
        flex-grow: 1;
    }
}

.date {
    display: none;
    width: rem(70);

    @include media('>=md') {
        display: initial;

        &.item--button {
            display: flex;
        }
    }
}

.framework {
    display: none;

    @include media('>=lg') {
        display: initial;
        width: rem(100);

        &.item--button {
            display: flex;
        }
    }
}

.tag_group {
    display: none;

    @include media('>=md') {
        display: initial;
        flex-grow: 1;
        flex-shrink: 100;
    }
}

.rate {
    display: none;

    @include media('>=lg') {
        display: flex;
        min-width: rem(100);
    }
}

.search {
    --v-search-input-display: none;

    @include media('>=lg') {
        --v-search-input-display: flex;
    }
}

.search,
.link-icon {
    display: flex;
    flex-shrink: 0;
    justify-content: flex-end;

    @include media('>=lg') {
        width: rem(140);

        .root--project-open & {
            max-width: rem(100);
        }
    }
}
</style>
