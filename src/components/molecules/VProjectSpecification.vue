<template>
    <div :class="$style.root">
        <div :class="$style.head" class="text-body-s">
            <div v-if="framework" :class="$style.framework">{{ framework }}</div>
            <div v-if="date">{{ date }}</div>
            <a :href="link" target="_blank" :class="$style.link">{{ linkLabel || 'Découvrir' }}</a>
        </div>
        <div :class="$style.tags">
            <v-button v-for="tag in tags" :key="tag" v-bind="buttonProps" :label="tag" @click="onTagClick(tag)" />
        </div>
        <!--        <div v-if="date">{{ date }}</div>-->
        <v-text v-if="content" :content="content" class="text-body-s" :class="$style.content" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import MutationType from '~/constants/mutation-type'
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
    computed: {
        filteredTags(): string[] {
            return this.$store.state.tagFilters
        },
        buttonProps() {
            return {
                filled: true,
                size: 's',
                theme: 'dark',
            }
        },
    },
    methods: {
        onFrameworkClick(_tag: string) {},
        onTagClick(tag: string) {
            if (this.isActiveTag(tag)) {
                // remove tag
                const tags = this.filteredTags.filter((filteredTag) => filteredTag !== tag)
                this.$store.commit(MutationType.TAG_FILTERS, tags)
            } else {
                // add tag
                this.$store.commit(MutationType.TAG_FILTERS, [...this.filteredTags, tag])
            }
        },
        isActiveTag(tag: string): boolean {
            return this.filteredTags.includes(tag)
        },
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
