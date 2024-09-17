<script  lang="ts" setup>
import { computed } from 'vue'

interface VProjectCardProps {
    project: Record<string, unknown>
}
const props = defineProps<VProjectCardProps>()

const linkPath = computed(() => props.project.url || props.project.uid)
</script>

<template>
    <!--        :is="linkPath ? NuxtLink : 'div'" -->
    <component
        :is="'div'"
        :to="linkPath"
        :class="$style.root"
    >
        {{ project.data.title || project.uid }}
    </component>
</template>

<style lang="scss" module>
.root {
    position: relative;
}
</style>
