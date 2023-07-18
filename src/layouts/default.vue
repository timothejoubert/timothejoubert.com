<template>
    <div :class="rootClasses" :style="colorThemeStyle">
        <client-only>
            <v-blur-screen v-if="isSplashScreenDone && isDocumentFocused === false" />
        </client-only>

        <div :class="[$style.body, isProjectOpen && $style['body--minify']]">
            <v-splash-screen v-if="isSplashScreenEnabled" />
            <v-top-bar />
            <v-main />
            <nuxt v-if="isHomePage" />
            <v-about />
        </div>

        <transition name="project-modal">
            <div v-if="isProjectOpen" ref="project" :class="$style.project">
                <Nuxt />
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import type { Route } from 'vue-router'
import Resize from '~/mixins/Resize'
import MutationType from '~/constants/mutation-type'
import SplashScreen from '~/mixins/SplashScreen'
import DocumentFocus from '~/mixins/DocumentFocus'

export default mixins(Resize, SplashScreen, DocumentFocus).extend({
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
        isProjectOpen(): boolean {
            return this.$store.getters.isProjectOpen
        },
        isHomePage() {
            return this.$store.getters.isHomePage
        },
        colorThemeStyle() {
            return {
                '--theme-foreground-color': this.$store.state.uiTheme.foreground,
                '--theme-accent-color': this.$store.state.uiTheme.accent,
                '--theme-background-color': this.$store.state.uiTheme.background,
            }
        },
    },
    watch: {
        $route(current: Route, previous) {
            const isProjectSwitching =
                this.$store.getters.isProjectUid(current.params.pathMatch) &&
                this.$store.getters.isProjectUid(previous.params.pathMatch)

            isProjectSwitching && this.$refs.project.scrollTo({ top: 0, behavior: 'smooth' })
        },
    },
})
</script>

<style lang="scss" module>
@include v-transition(
    'project-modal',
    (
        duration: 0.7s,
    ),
    (
        translate: 100% 0,
    ),
    $scope: 'local'
);

.root {
    //@include theme(dark);

    position: relative;
    display: flex;
    overflow: hidden;
    /* stylelint-disable-next-line unit-no-unknown */
    max-height: 100svh;
    background-color: var(--theme-background-color);
    color: var(--theme-foreground-color);

    &--splash-screen-displayed {
        overflow: hidden;
        //max-height: 100vh;
    }
}

.body,
.project {
    @include scroll-bar-hidden;
}

.body {
    width: 100%;
    flex-shrink: 0;
    transition: width 0.7s ease(out-quad);

    &--minify {
        width: 50%;
    }
}

.project {
    position: relative;
    min-width: 50%;
    border-left: 1px solid var(--theme-foreground-color);
}
</style>
