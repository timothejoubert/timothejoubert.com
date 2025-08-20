<script lang="ts">
import type { ComponentOrTagName } from '~/types/app'

export type VWrapperProps = { wrapper?: ComponentOrTagName | false | undefined }
</script>

<script lang="ts" setup>
/**
* An condional wrapper element for the slot
**/

defineProps<VWrapperProps>()

defineOptions({
    inheritAttrs: false,
})
</script>

<template>
    <component
        :is="wrapper"
        v-if="wrapper"
        v-bind="$attrs"
    >
        <slot />
    </component>
    <template v-else>
        <slot />
    </template>
</template>
