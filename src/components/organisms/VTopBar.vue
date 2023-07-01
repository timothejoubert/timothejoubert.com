<template>
    <div :class="$style.root" class="container">
        <nuxt-link :to="homeLink" :class="$style.home">
            <icon-logo :class="$style.logo" />
            <div :class="$style['logo-text']">{{ logoText }}</div>
        </nuxt-link>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconLogo from '~/assets/images/logo.svg?sprite'

export default Vue.extend({
    name: 'VTopBar',
    components: { IconLogo },
    computed: {
        homeLink(): string {
            return this.$getLocalePath() || '/'
        },
        logoText(): string {
            return this.$store.state.settings?.data?.website_name || this.$config.appName
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
    align-items: center;
    background-color: color(black);
    color: color(white);
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
