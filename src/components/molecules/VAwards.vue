<template>
    <div :class="$style.root">
        <v-link v-for="(award, i) in awards" :key="i" :reference="award.link" :class="$style.link" :title="award.name">
            <icon-award :class="$style.icon" />
        </v-link>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import type { LinkField } from '@prismicio/types'
import IconAward from '~/assets/images/icons/award.svg?sprite'

export interface AwardProps {
    link: LinkField
    name: string
    type: string
}

export default Vue.extend({
    name: 'VAwards',
    components: { IconAward },
    props: {
        awards: Array as PropType<AwardProps[]>,
    },
})
</script>

<style lang="scss" module>
.root {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: rem(12);
}

.link {
    display: flex;
    align-items: center;
    font-size: rem(14);
    font-weight: 500;
    gap: rem(4);
    text-transform: uppercase;
    transition: color 0.3s;

    @media (hover: hover) {
        &:hover {
            color: var(--theme-accent-color);
        }
    }
}

.icon {
    width: rem(24);
    aspect-ratio: 1;
}
</style>
