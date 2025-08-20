<script lang="ts" setup>
import type { ProjectDocument } from '~~/prismicio-types'
import type { VWrapperProps } from '~/components/atoms/VWrapper.vue'

const props = defineProps<{
    project: ProjectDocument
} & VWrapperProps>()

const tags = computed(() => {
    if (props.project.data.tag_group?.length) return props.project.data.tag_group.filter(item => item.tag).map(item => item.tag)
    return props.project.tags || []
})
</script>

<template>
    <UICard
        :wrapper="wrapper"
        :title="project.data.title"
        :content="project.data.date"
        :image="project.data.thumbnail"
        :tags="tags"
        :url="project.url"
    />
</template>

<style lang="scss" module>

</style>
