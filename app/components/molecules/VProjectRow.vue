<script  lang="ts" setup>
import type { ProjectDocument } from '~/prismicio-types'

const props = defineProps<{
	project: ProjectDocument
}>()

const tags = computed(() => {
	if (props.project.data.tag_group?.length) return props.project.data.tag_group.filter(item => item.tag).map(item => item.tag)
	return props.project.tags || []
})
</script>

<template>
    <VPrismicLink
        :to="props.project"
        :class="$style.root"
    >
        <div
            :class="$style.title"
            class="text-over-title-sm"
        >
            {{ project.data.title }}
        </div>
        <VTag
            v-for="tag in tags"
            :key="tag"
            :label="tag"
        />
        <VIcon name="arrow-up-right" />
    </VPrismicLink>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    width: 100%;
    height: var(--v-project-row-height);
    align-items: center;
    justify-content: space-between;
    color: inherit;
    gap: 14px;
    padding-block: var(--v-project-row-padding-block, 14px);
    text-decoration: none;
}

.title {
    overflow: hidden;
    margin-right: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
