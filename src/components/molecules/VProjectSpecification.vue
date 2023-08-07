<template>
    <div :class="$style.root">
        <div :class="$style.head">
            <v-button
                v-for="tag in tags"
                :key="tag"
                :class="$style.tag"
                tag="div"
                filled
                size="s"
                theme="dark"
                :label="tag"
            />
            <div :class="$style.specifications">
                <div v-if="framework" :class="$style.framework">{{ framework }}</div>
                <div v-if="date">{{ date }}</div>
                <a v-if="link" :href="link" target="_blank" :class="$style.link">{{ linkLabel || 'Découvrir' }}</a>
            </div>
        </div>
        <v-text v-if="excerpt" :content="excerpt" :class="$style.excerpt" />
        <v-collapsable v-if="hasContent" :class="$style['more-content']" label="Voir les détails">
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
        content: [Array, String] as PropType<PrismicRichText | String>,
        excerpt: Array as PropType<PrismicRichText>,
    },
    computed: {
        hasContent() {
            return (typeof this.content === 'string' && !!this.content) || !!this.content?.length
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
}

.head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: rem(10);
    margin-block: rem(40) rem(24);
}

.tag {
    &:nth-last-child(1 of .tag) {
        margin-right: rem(8);
    }
}

.specifications {
    @include arrow-link;

    --v-button-padding: 0;

    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: rem(11);

    & > *:not(:last-child)::after {
        position: relative;
        margin-left: rem(11);
        content: '|';
    }
}

.framework {
    font-weight: 500;
}

.excerpt {
    font-style: italic;
    margin-block: rem(16);
}

.more-content {
    margin-bottom: rem(40);
}

.content {
    margin-top: rem(16);
    opacity: 0.8;
}
</style>
