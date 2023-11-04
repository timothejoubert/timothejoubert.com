<template>
    <div :class="$style.root">
        <v-markdown-bold
            v-if="description"
            :content="description"
            wrapper-tag="h1"
            :class="$style.description"
            class="text-over-title-l"
        />
        <div :class="$style.content">
            <v-about-column v-for="(column, i) in columns" :key="i" v-bind="column" :class="$style.column" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import { SettingsDocumentData } from '~~/prismicio-types'

export default Vue.extend({
    name: 'VAboutContent',
    computed: {
        description() {
            return this.$store.getters.settings?.data?.about_content
        },
        columns() {
            return this.$store.getters.settings?.data.columns
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    margin-inline: auto;

    @include media('>=md') {
        max-width: rem(1000);
    }
}

.description {
    isolation: isolate;
    margin-block: rem(60) rem(100);
    text-wrap: balance;

    & :global(.v-markdown-bold-strong),
    & strong {
        position: relative;
        display: inline-flex;
        padding: rem(5) rem(4) rem(7);
        color: var(--theme-accent-color);
        font-weight: initial;
        margin-block: rem(8);

        &::after {
            position: absolute;
            z-index: -1;
            background-color: var(--theme-accent-color);
            border-radius: rem(3);
            content: '';
            inset: 0;
            opacity: 0.1;
        }
    }

    @include media('>=sm') {
        margin-block: rem(60) rem(160);
    }
}

.content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding-bottom: rem(100);
    gap: rem(70);

    @include media('>=sm') {
        //padding-bottom: initial;
        gap: rem(100);
    }
}

.column {
    flex-grow: 1;

    @include media('>=sm') {
        max-width: rem(280);
    }
}
</style>
