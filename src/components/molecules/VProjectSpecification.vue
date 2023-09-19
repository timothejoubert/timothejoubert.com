<template>
    <div :class="$style.root">
        <div :class="$style.head">
            <template v-if="tags && tags.length">
                <v-button
                    v-for="tag in tags"
                    :key="tag.id"
                    :class="$style.tag"
                    tag="div"
                    size="s"
                    theme="dark"
                    :label="tag.label"
                    filled
                />
            </template>
            <div :class="$style.specifications">
                <!--                <div v-if="framework" :class="$style.framework">{{ framework }}</div>-->
                <!--                <div v-if="date">{{ date }}</div>-->
                <v-button
                    v-if="link"
                    :class="$style.link"
                    size="s"
                    theme="dark"
                    outlined
                    :href="link"
                    animate
                    :label="linkLabel || 'Découvrir'"
                >
                    <template #icon>
                        <icon-arrow />
                    </template>
                </v-button>
            </div>
            <v-awards v-if="awards.length" :awards="awards" :class="$style.award" />
        </div>
        <v-text v-if="excerpt" tag="h3" :content="excerpt" :class="$style.excerpt" />
        <v-collapsable v-if="hasContent" :class="$style['more-content']" label="Voir les détails">
            <v-text tag="h4" :content="content" :class="$style.content" />
        </v-collapsable>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { PrismicRichText } from '~/types/app'
import { Tag } from '~/utils/tags'
import IconArrow from '~/assets/images/icons/arrow-up-right.svg?sprite'
import { AwardProps } from '~/components/molecules/VAwards.vue'

export default Vue.extend({
    name: 'VProjectSpecification',
    components: { IconArrow },
    props: {
        date: [String, Number],
        link: String,
        linkLabel: String,
        framework: String,
        awards: { type: Array as PropType<AwardProps[]>, default: () => [] },
        tags: { type: Array as PropType<Tag[]>, default: () => [] },
        content: [Array, String] as PropType<PrismicRichText | String>,
        excerpt: Array as PropType<PrismicRichText>,
    },
    computed: {
        hasContent() {
            return (
                (typeof this.content === 'string' && !!this.content) || !!(this.content?.[0] as { text?: string })?.text
            )
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
    margin-block: rem(20) rem(26);
}

//.tag {
//    &:nth-last-child(1 of .tag) {
//        margin-right: rem(8);
//    }
//}

.link {
    --v-button-padding: #{0 rem(8) 0 rem(18)} !important;
}

.award {
    margin-left: rem(8);
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
    line-height: 1.4;
    margin-block: rem(16);

    a {
        text-decoration: underline;
    }
}

.more-content {
    margin-bottom: rem(40);
}

.content {
    margin-top: rem(16);
    opacity: 0.9;

    a {
        text-decoration: underline;
    }
}
</style>
