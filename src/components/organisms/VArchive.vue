<template>
    <div :class="$style.root" class="container">
        <div :class="$style.title" class="text-body-l">Archive</div>
        <div :class="$style.top">
            <v-button
                v-for="button in buttons"
                :key="button.id"
                :class="[
                    $style.button,
                    $style[`button--${button.id}`],
                    button.id === sortId && $style['button--active'],
                    sortOrder === 'DESC' && button.id === sortId && $style['button--desc'],
                ]"
                :label="button.label"
                theme="light"
                :inert="!button.sortable"
                @click="onButtonClick(button.id)"
            >
                <template v-if="button.sortable" #icon>
                    <div :class="$style.arrow"></div>
                </template>
            </v-button>
        </div>
        <v-archive-list :sort-id="sortId" :sort-order="sortOrder" :sort-data="{ id: sortId, order: sortOrder }" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

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
        label: 'Tags',
        id: 'tags',
    },
]

interface ArchiveSetting {
    label: string
    id: string
    sortable?: boolean
}

export default Vue.extend({
    name: 'VArchive',
    data() {
        return {
            sortId: 'date',
            sortOrder: 'ASC' as 'ASC' | 'DESC',
        }
    },
    computed: {
        buttons(): ArchiveSetting[] {
            const result: ArchiveSetting[] = DISPLAYED_INFO.map((info) => {
                return {
                    label: info.label,
                    id: info.id,
                    sortable: true,
                }
            })
            result.push({ label: 'Lien', id: 'link' })

            return result
        },
    },
    methods: {
        onButtonClick(id: string) {
            this.sortOrder === 'ASC' ? (this.sortOrder = 'DESC') : (this.sortOrder = 'ASC')

            if (this.sortId !== id) this.sortId = id
        },
    },
})
</script>

<style lang="scss" module>
.root {
    margin-block: rem(60) rem(60);
}

.title {
    margin-bottom: rem(42);
}

.top {
    display: flex;
    gap: rem(36);
}

.button {
    --v-button-padding: 0;

    opacity: 0.5;

    &--active {
        opacity: 0.8;
    }

    &--title {
        width: rem(160);
    }

    &--date {
        width: rem(70);
    }

    &--framework {
        width: clamp(15%, rem(50), rem(400));
    }

    &--tags {
        flex-grow: 1;
    }
}

.arrow {
    width: rem(10);
    height: rem(10);
    border-width: 1px 1px 0 0;
    border-style: solid;
    border-color: var(--theme-foreground-color);
    rotate: 135deg;
    transform-origin: center;
    transition: rotate 0.3s ease(out-quad);
    translate: 0 rem(0);

    .button--desc & {
        rotate: -45deg;
    }
}
</style>
