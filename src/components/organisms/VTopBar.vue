<template>
    <div :class="$style.root" class="container">
        <nuxt-link
            :to="homeLink"
            :class="$style['back-home']"
            :event="isLinkDisabled ? '' : 'click'"
            @click.native="onClick"
        >
            <div :class="$style.logo">
                <span :class="$style.logo__inner">T</span>
            </div>
            <v-interactive-text :class="$style['logo-text']" class="text-h2" :content="logoText" />
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

.back-home {
    display: flex;
    align-items: center;
    gap: rem(12);
}

.logo {
    display: none;

    @include media('>=550px') {
        display: flex;
        overflow: hidden;
        width: rem(24);
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        background-color: var(--theme-foreground-color);
        border-radius: 0 50% 0 0;
        color: var(--theme-background-color);
        font-size: rem(18);
        font-weight: 900;
    }
}

.logo__inner {
    position: absolute;
    //scale: 0;
    //transition: scale 0.3s ease(out-quad);
    translate: 0 1px;

    //@media (hover: hover) {
    //    .back-home:hover & {
    //        scale: 1;
    //    }
    //}
}

.logo-text {
    --font-weight: 700;

    white-space: nowrap;
}
</style>
