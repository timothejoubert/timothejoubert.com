<template>
    <div :class="$style.root">
        <div :class="$style.tags">
            <v-button v-for="tag in tags" :key="tag" tag="div" filled size="s" theme="dark" :label="tag" />
        </div>
        <div :class="$style.head" class="text-body-s">
            <div v-if="framework" :class="$style.framework">{{ framework }}</div>
            <div v-if="date">{{ date }}</div>
            <a v-if="link" :href="link" target="_blank" :class="$style.link">{{ linkLabel || 'Découvrir' }}</a>
        </div>
        <v-text v-if="excerpt" :content="excerpt" :class="$style.excerpt" />
        <v-collapsable v-if="content" :class="$style['more-content']" label="Voir les détails">
            <v-text :content="content" :class="$style.content" class="text-body-xs" />
        </v-collapsable>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { PrismicRichText } from '~/types/app'

export default Vue.extend({
    name: 'VProjectSpecification',
    props: {
        date: String,
        link: String,
        linkLabel: String,
        framework: String,
        tags: { type: Array as PropType<String[]>, default: () => [] },
        content: Array as PropType<PrismicRichText>,
        excerpt: Array as PropType<PrismicRichText>,
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
}
.head {
    @include arrow-link;

    --v-button-padding: 0;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: rem(20);

    & > *:not(:last-child)::after {
        position: relative;
        content: '|';
        margin-inline: rem(14);
    }
}

.framework {
    font-weight: 500;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: rem(16);
}

.excerpt {
    margin-block: rem(20);
}

.more-content {
    margin-block: rem(40) rem(28);
}

.content {
    margin-top: rem(16);
    opacity: 0.8;
}
</style>
