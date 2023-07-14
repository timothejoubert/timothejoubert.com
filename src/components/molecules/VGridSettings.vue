<template>
    <div :class="$style.root">
        <div :class="$style.shapes" @mouseleave="onMouseLeave">
            <button
                v-for="index in 7"
                :key="index"
                :class="[$style.shape, index <= current && $style['shape--selected']]"
                :inert="index < minColumn"
                @mouseenter="onMouseEnter(index)"
                @click="onClick(index)"
            ></button>
        </div>
        <v-button
            :class="[$style.button, $style['button-interact']]"
            label="-"
            theme="dark"
            size="s"
            outlined
            @click="remove"
        />
        <v-button
            :class="[$style.button, $style['button-indicator']]"
            tag="div"
            :label="columns + ' colonnes'"
            theme="dark"
            size="s"
            filled
        />
        <v-button
            :class="[$style.button, $style['button-interact']]"
            label="+"
            theme="dark"
            size="s"
            outlined
            @click="add"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VGridSettings',
    data() {
        return {
            current: '0',
            minColumn: 2,
        }
    },
    computed: {
        columns(): string {
            return this.$store.state.uiColumns
        },
    },
    watch: {
        '$store.state.uiColumns': {
            handler(value) {
                this.current = value
            },
            immediate: true,
        },
    },
    methods: {
        onMouseEnter(index: string) {
            this.current = this.clampIndex(index)
        },
        onMouseLeave() {
            this.current = this.columns
        },
        remove() {
            this.update((parseInt(this.columns) - 1).toString())
        },
        add() {
            this.update((parseInt(this.columns) + 1).toString())
        },
        onClick(index: string) {
            this.update(index)
        },
        clampIndex(index: string) {
            return Math.min(Math.max(parseInt(index), this.minColumn), 8).toString()
        },
        update(index: string) {
            this.$store.commit(MutationType.UI_COLUMNS, this.clampIndex(index))
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
}

.shapes {
    display: flex;
    margin-bottom: rem(20);
    gap: rem(8);
}

.shape {
    position: relative;
    width: rem(22);
    height: rem(22);
    background-color: var(--theme-foreground-color);
    border-radius: 0 9px 0 0;

    &::before,
    &::after {
        position: absolute;
        border-radius: 0 9px 0 0;
        content: '';
        inset: 0;
        opacity: 0;
        transition: opacity 0.3s;
    }

    &::before {
        background-color: var(--theme-accent-color);
    }

    &--selected::before {
        opacity: 1;
    }

    &::after {
        background-color: var(--theme-background-color);
    }

    .shapes:hover &:not(#{&}--selected)::after {
        opacity: 0.3;
    }
}

.button-indicator {
    --v-button-min-width: #{rem(120)} !important;
}

.button-interact {
    --v-button-min-width: #{rem(40)} !important;
}
</style>