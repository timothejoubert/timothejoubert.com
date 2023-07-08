<template>
    <div :class="$style.root" class="container">
        <nuxt-link :to="homeLink" :class="$style.home" @click.native="onClick">
            <icon-logo :class="$style.logo" />
            <div :class="$style['logo-text']" class="text-h2">{{ logoText }}</div>
        </nuxt-link>

        <v-toggle-settings />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconLogo from '~/assets/images/logo.svg?sprite'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VTopBar',
    components: { IconLogo },
    computed: {
        homeLink(): string {
            return this.$getLocalePath() || '/'
        },
        logoText(): string {
            return this.$store.getters.settings?.data?.website_name || this.$config.appName
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
    width: rem(32);
    height: auto;
}
</style>
