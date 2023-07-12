<template>
    <div :class="$style.root">
        <div :class="$style.head" class="text-body-s">
            <div v-if="framework" :class="$style.framework">{{ framework }}</div>
            <div v-if="date">{{ date }}</div>
            <a v-if="link" :href="link" target="_blank" :class="$style.link">{{ linkLabel || 'Découvrir' }}</a>
        </div>
        <div :class="$style.tags">
            <v-button v-for="tag in tags" :key="tag" tag="div" filled size="s" theme="dark" :label="tag" />
        </div>
        <v-text v-if="content" :content="content" class="text-body-s" :class="$style.content" />
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

.content {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    margin-block: rem(40) rem(28);
    opacity: 0.8;
}
</style>
