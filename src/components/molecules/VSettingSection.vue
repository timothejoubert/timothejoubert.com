<template>
    <div :class="[$style.root, hasContentFilled && $style['root--content-filled']]">
        <div :class="$style.head" class="text-over-title-xs">
            <span :class="$style.title">{{ title }}</span>
            <v-interactive-text
                v-if="hasReset"
                tag="button"
                content="Reset"
                :class="$style.reset"
                :inert="!hasContentFilled"
                :trigger-event="interactiveTextTrigger"
                @click.native="$emit('onResetClicked')"
            />
            <!--            <button v-if="hasReset" :class="$style.reset" @click="$emit('onResetClicked')">Reset</button>-->
        </div>
        <slot name="default" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import EventType from '~/constants/event-type'

export default Vue.extend({
    name: 'VSettingSection',
    props: {
        title: String,
        hasContentFilled: Boolean,
        hasReset: { type: Boolean, default: true },
    },
    computed: {
        interactiveTextTrigger(): string {
            return EventType.SETTING_TRANSITION_END
        },
    },
})
</script>
<style lang="scss" module>
.root {
    flex-grow: 1;
}

.head {
    display: flex;
    min-height: rem(28);
    margin-bottom: rem(30);
    font-weight: 550 !important;
}

.title {
    display: flex;
    min-width: rem(160);
    align-items: center;
    background-color: var(--theme-foreground-color);
    color: var(--theme-background-color);
    padding-inline: rem(12);
}

.reset {
    position: relative;
    padding: rem(3) rem(16);
    color: var(--theme-foreground-color);
    font-size: rem(13);
    font-weight: 500;
    opacity: 0.4;

    .root--content-filled & {
        opacity: 1;
    }

    .root--content-filled &::before {
        position: absolute;
        border: var(--theme-foreground-color) 2px solid;
        content: '';
        inset: 0;
    }
}
</style>
