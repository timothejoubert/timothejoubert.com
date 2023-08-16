<template>
    <div :class="[$style.root, selectedTags.length && $style['root--tags-active']]" class="container">
        <div :class="$style.tags">
            <v-button
                v-if="!enableOneTag"
                :animate="!!selectedTags.length"
                size="s"
                label="Reset"
                theme="light"
                :class="$style.reset"
                @click="resetTags"
            />
            <v-button
                v-for="tag in tags"
                :key="tag.value"
                :theme="selectedTags.includes(tag.value) ? 'accent' : 'dark'"
                size="s"
                filled
                :label="tag.label"
                animate
                @click="onTagClicked(tag.value)"
            />
        </div>
        <v-column-input :class="$style.columns" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { ProjectTagDocument } from '~~/prismicio-types'
import { VSelectOption } from '~/components/atoms/VSelect.vue'
import MutationType from '~/constants/mutation-type'
import AppConst from '~/constants/app'
import toBoolean from '~/utils/to-boolean'

export default Vue.extend({
    name: 'VTopSetting',
    computed: {
        tags(): VSelectOption[] {
            return this.$store.getters.projectTags?.map((tag: ProjectTagDocument) => {
                return { value: tag.uid, label: tag.data.name }
            })
        },
        selectedTags(): string[] {
            return this.$store.state.tagFilters
        },
        enableOneTag(): boolean {
            return toBoolean(AppConst.ONLY_ONE_TAG_ALLOW)
        },
    },
    methods: {
        onTagClicked(value: string) {
            const tags = this.selectedTags.slice()
            const tagIndex = this.selectedTags.indexOf(value)

            if (this.enableOneTag && tagIndex === -1) {
                tags.length = 0
                tags.push(value)
            } else if (tagIndex === -1) tags.push(value)
            else tags.splice(tagIndex, 1)

            this.$store.commit(MutationType.TAG_FILTERS, tags)
        },
        resetTags() {
            this.$store.commit(MutationType.TAG_FILTERS, [])
        },
    },
})
</script>
<style lang="scss" module="">
.root {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: rem(40);
    margin-block: rem(20) rem(26);
}

.tags {
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: rem(8);
}

.reset {
    --v-button-min-width: 0;
    --v-button-padding: 0;

    margin-right: rem(10);

    .root--tags-active & {
        text-decoration: underline;
        text-underline-offset: 2px;
    }
}

.columns {
    display: none;

    @include media('>=lg') {
        display: block;
    }
}
</style>
