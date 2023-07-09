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
    & em {
        @include text-body-xs;

        font-style: initial;
        opacity: 0.6;
    }

    & a {
        position: relative;
    }

    & a::after,
    & a::before {
        position: absolute;
        top: rem(2);
        right: rem(-20);
        display: block;
        width: rem(10);
        height: rem(10);
        content: '';
        opacity: 0.6;
        transition: opacity 0.3s ease(out-quad);
    }

    & a::after {
        border: solid var(--theme-foreground-color);
        border-width: 2px 2px 0 0;
    }

    & a::before {
        border-right: 2px solid var(--theme-foreground-color);
        rotate: 45deg;
        scale: 1 1.6;
        transform-origin: top right;
        transition: scale 0.3s ease(out-quad);
        translate: 0 1px;
    }

    & a:hover::before {
        scale: 1 1.2;
    }

    & a:hover::after,
    & a:hover::before {
        opacity: 1;
    }
}
</style>
