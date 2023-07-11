<template>
    <div :class="$style.root">
        <div :class="$style.title" class="text-over-title-xs">{{ title }}</div>
        <v-text :content="content" :class="$style.content" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import type { RichTextField } from '@prismicio/types'

export default Vue.extend({
    name: 'VAboutColumn',
    props: {
        title: String,
        content: [String, Array] as PropType<String | RichTextField>,
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
}
.title {
    margin-bottom: rem(38);
    font-weight: 500;
    opacity: 0.4;
}

.content {
    @include arrow-link;

    & strong {
        font-weight: 500;
    }

    & em {
        @include text-body-xs;

        font-style: initial;
        opacity: 0.6;
    }
}
</style>
