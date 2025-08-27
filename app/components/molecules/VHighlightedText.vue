<script lang="ts" setup>
import type { RichTextField } from '@prismicio/types'

defineProps<{
	field: RichTextField
	wrapper?: string
}>()
</script>

<template>
    <component
        :is="wrapper || 'div'"
        :class="$style.root"
    >
        <VRichText :field="field">
            <template #default="scopedSlot">
                <div
                    v-if="scopedSlot.type === 'strong'"
                    :class="$style.highlight"
                >
                    <VSplitText
                        render="chars"
                        :content="scopedSlot.content"
                    />
                </div>
                <component
                    :is="scopedSlot.type"
                    v-else
                    :class="$style.tag"
                >
                    {{ scopedSlot.content }}
                </component>
            </template>
        </VRichText>
    </component>
</template>

<style lang="scss" module>
.root {
    line-height: 1.6;
}

.highlight {
    position: relative;
    display: inline;
    padding: 1px 7px 3px;
    border-radius: 3px;

    // background-color: var(--color-surface);
    // color: var(--color-content);
    background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);
    color: var(--color-accent);
}
</style>
