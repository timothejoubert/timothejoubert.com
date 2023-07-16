<template>
    <div :class="[$style.root, collapsed && $style['root--collapsed']]">
        <button :class="$style.cta" @click="collapsed = !collapsed">
            <span :class="$style.label" class="text-body-xs">{{ label }}</span>
            <span :class="$style.icon"></span>
        </button>
        <div :class="$style.content">
            <div :class="$style.content__inner">
                <slot>
                    <v-text :content="content" />
                </slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { PrismicRichText } from '~/types/app'

export default Vue.extend({
    name: 'VCollapsable',
    props: {
        label: { type: String, default: 'Voir plus' },
        content: [String, Array] as PropType<String | PrismicRichText>,
    },
    data() {
        return {
            collapsed: true,
        }
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
}

.cta {
    display: flex;
    align-items: center;
    gap: rem(10);
}

.icon {
    position: relative;
    display: flex;
    width: rem(13);
    height: rem(13);
    align-items: center;
    justify-content: center;

    &::before,
    &::after {
        position: absolute;
        background-color: var(--theme-foreground-color);
        content: '';
    }

    &::before {
        width: 100%;
        height: 1px;
    }

    &::after {
        width: 1px;
        height: 100%;
        rotate: 90deg;
        transform-origin: center;
        transition: rotate 0.3s ease(out-quad);
    }

    .root--collapsed &::after {
        rotate: 0deg;
    }
}

.content {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows 0.5s;

    .root--collapsed & {
        grid-template-rows: 0fr;
    }
}

.content__inner {
    overflow: hidden;
    grid-row: 1 / 2;
}
</style>
