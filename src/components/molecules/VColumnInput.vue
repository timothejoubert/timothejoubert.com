<template>
    <div :class="$style.root">
        <div :class="$style.shapes" @mouseleave="onMouseLeave">
            <button
                v-for="index in maxColumnNumber"
                :key="index"
                :class="[$style.shape, index <= current && $style['shape--selected']]"
                :disabled="index < minColumnNumber"
                @mouseenter="onMouseEnter(index)"
                @click="onClick(index)"
            ></button>
        </div>
        <template v-if="displayButtons">
            <v-button
                :class="[$style.button, $style['button-interact']]"
                label="-"
                theme="dark"
                size="s"
                outlined
                :inert="current == minColumnNumber"
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
                :inert="current == maxColumnNumber"
                outlined
                @click="add"
            />
        </template>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VColumnInput',
    data() {
        return {
            displayButtons: false,
            current: '0',
            maxColumnNumber: 5,
            minColumnNumber: 2,
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
        '$store.state.isEveryProjectInFavorite'(value: boolean) {
            if (value) this.maxColumnNumber = 8
            else this.maxColumnNumber = 6
        },
        maxColumnNumber(max: number) {
            if (Number(this.current) > max) this.update(max.toString())
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
            return Math.min(Math.max(parseInt(index), this.minColumnNumber), this.maxColumnNumber).toString()
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
    margin-top: rem(1);
}

.shapes {
    display: flex;
    gap: rem(8);

    &:not(:last-child) {
        margin-bottom: rem(20);
    }
}

.shape {
    position: relative;
    width: rem(22);
    height: rem(22);
    background-color: var(--theme-foreground-color);
    border-radius: 0 9px 0 0;

    &[disabled] {
        cursor: not-allowed;
    }

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
    --v-button-min-width: #{rem(100)} !important;
}

.button-interact {
    --v-button-min-width: #{rem(40)} !important;
}

.cta-projects {
    margin-top: rem(24);
}
</style>
