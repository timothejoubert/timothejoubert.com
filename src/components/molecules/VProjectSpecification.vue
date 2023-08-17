<template>
    <div :class="$style.root">
        <div :class="$style.head">
            <template v-if="tags && tags.length">
                <v-button
                    v-for="tag in tags"
                    :key="tag.id"
                    :class="$style.tag"
                    tag="div"
                    filled
                    size="s"
                    theme="dark"
                    :label="tag.label"
                />
            </template>
            <div :class="$style.specifications">
                <div v-if="framework" :class="$style.framework">{{ framework }}</div>
                <div v-if="date">{{ date }}</div>
                <a v-if="link" :href="link" target="_blank" :class="$style.link">{{ linkLabel || 'Découvrir' }}</a>
            </div>
        </div>
        <v-text v-if="excerpt" tag="h3" :content="excerpt" :class="$style.excerpt" />
        <v-collapsable v-if="hasContent" :class="$style['more-content']" label="Voir les détails">
            <v-text tag="h4" :content="content" :class="$style.content" class="text-body-xs" />
        </v-collapsable>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { PrismicRichText } from '~/types/app'
import { Tag } from '~/utils/tags'

export default Vue.extend({
    name: 'VProjectSpecification',
    props: {
        date: [String, Number],
        link: String,
        linkLabel: String,
        framework: String,
        tags: { type: Array as PropType<Tag[]>, default: () => [] },
        content: [Array, String] as PropType<PrismicRichText | String>,
        excerpt: Array as PropType<PrismicRichText>,
    },
    computed: {
        hasContent() {
            return (typeof this.content === 'string' && !!this.content) || !!this.content?.length
        },
        // buttons(): string[] {
        //     const tags = this.tags.map((tag) => tag.label)
        //     return [...tags, this.framework, this.date.toString()]
        // },
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
    margin-block: rem(20);
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

    a {
        text-decoration: underline;
    }
}
</style>
