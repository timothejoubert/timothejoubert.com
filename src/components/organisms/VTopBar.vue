<template>
    <div :class="$style.root" class="container">
        <nuxt-link :to="homeLink" :class="$style.home" :inert="isLinkDisabled" @click.native="onClick">
            <div :class="$style.logo"></div>
            <div :class="$style['logo-text']" class="text-h2">{{ logoText }}</div>
        </nuxt-link>

        <v-theme-switcher />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VTopBar',
    computed: {
        homeLink(): string {
            // this?.$getLocalePath() || '/'
            return '/'
        },
        logoText(): string {
            return this.$store.getters.settings?.data?.website_name || this.$config.appName
        },
        isLinkDisabled() {
            return this.$route.fullPath === '/' && !this.$store.state.isAboutOpen
        },
    },
    methods: {
        onClick() {
            const isAboutOpen = this.$store.state.isAboutOpen
            if (isAboutOpen) this.$store.commit(MutationType.ABOUT_OPENED, false)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: sticky;
    z-index: 101;
    top: 0;
    display: flex;
    height: $v-top-bar-height;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
}

.home {
    display: flex;
    align-items: center;
    gap: rem(12);
}

.logo {
    overflow: hidden;
    width: rem(24);
    aspect-ratio: 1;
    background-color: var(--theme-foreground-color);
    border-radius: 0 50% 0 0;
}
</style>
