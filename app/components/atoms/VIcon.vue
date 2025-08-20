<script setup lang="ts">
defineProps({
    name: {
        type: String,
        required: true,
    },
    mode: {
      type: String as PropType<'svg' | 'css'>,
      required: false,
      default: null,
    },
    size: {
      type: [Number, String],
      required: false,
      default: null,
    },
})
</script>

<template>
    <NuxtIcon
        aria-hidden="true"
        :name="'icon:' + name"
        :size="size"
        :mode="mode"
    />
</template>
