<template>
    <div :class="rootClasses">
        <v-splash-screen-wrapper v-if="isSplashScreenDisplayed" />
        <v-top-bar />

        <v-main />
        <Nuxt />

        <v-about-toggle />
    </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import Resize from '~/mixins/Resize'
import MutationType from '~/constants/mutation-type'
import SplashScreen from '~/mixins/SplashScreen'

export default mixins(Resize, SplashScreen).extend({
    name: 'default',
    mounted() {
        this.$store.commit(
            MutationType.PREFERS_REDUCED_MOTION,
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
    },
    computed: {
        rootClasses(): (string | false | undefined)[] {
            return [this.$style.root, ...this.splashScreenClasses]
        },
    },
})
</script>

<style lang="scss" module>
.root {
    @include theme(dark);

    position: relative;
    /* stylelint-disable-next-line unit-no-unknown */
    min-height: 100svh;
    padding-bottom: $v-top-bar-height;
    background-color: var(--theme-background-color);
    color: var(--theme-foreground-color);

    &--splash-screen-displayed {
        overflow: hidden;
        max-height: 100vh;
    }
}
</style>
