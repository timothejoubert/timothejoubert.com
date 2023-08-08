<template>
    <div :class="$style.root" class="container">
        <div :class="$style.tags">
            <v-button size="s" filled label="Reset" @click="resetTags" />
            <v-button
                v-for="tag in tags"
                :key="tag.value"
                :theme="selectedTags.includes(tag.value) ? 'accent' : 'dark'"
                size="s"
                filled
                :label="tag.label"
                @click="onTagClicked(tag.value)"
            />
        </div>
        <v-column-input />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { ProjectTagDocument } from '~~/prismicio-types'
import { VSelectOption } from '~/components/atoms/VSelect.vue'
import MutationType from '~/constants/mutation-type'

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
    },
    methods: {
        onTagClicked(value: string) {
            const tags = this.selectedTags.slice()
            const tagIndex = this.selectedTags.indexOf(value)

            if (tagIndex === -1) tags.push(value)
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
    margin-block: rem(20);
}

.tags {
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: rem(10);
}
</style>
