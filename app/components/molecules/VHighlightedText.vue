<script lang="ts" setup>
import type { RichTextField } from '@prismicio/types'

defineProps<{
    field: RichTextField
    wrapper?: string
}>()
</script>
<template>
    <component :is="wrapper || 'div'" :class="$style.root">
        <VRichText :field="field">
            <template #default="scopedSlot">
                <div v-if="scopedSlot.type === 'strong'" :class="$style.highlight">
                    <VSplitText  render="chars" :content="scopedSlot.content" />
                </div>
                <component v-else :is="scopedSlot.type" :class="$style.tag">{{ scopedSlot.content }}</component>
            </template>
        </VRichText>
    </component>
</template>
<style lang="scss" module>

.root {
    --v-highlighted-text-color: red;

    line-height: 1.6;
}

.highlight {
    position: relative;
    display: inline;
    color: var(--v-highlighted-text-color);
    background-color: color-mix(in srgb, var(--v-highlighted-text-color) 20%, transparent);
    padding: 1px 4px 3px;
    border-radius: 3px;
}
</style>
