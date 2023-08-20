<template>
    <div :class="rootClasses" :style="colorThemeStyle">
        <client-only>
            <transition name="fade">
                <v-blur-screen v-if="isSplashScreenDone && isDocumentFocused === false" />
            </transition>
        </client-only>

        <div :class="[$style.body, isProjectOpen && $style['body--minify']]" @click="onBodyClick">
            <v-splash-screen v-if="isSplashScreenEnabled" />
            <v-top-bar />

            <!--            <v-setting ref="setting" :class="$style.setting" :inert="!isSettingOpen" />-->
            <v-favorite-setting :inert="isBodyContentInert" />
            <v-favorite-project-list :inert="isBodyContentInert" />

            <v-archive :inert="isBodyContentInert" />

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
import eventBus from '~/utils/event-bus'
import EventType from '~/constants/event-type'

export default mixins(Resize, SplashScreen, DocumentFocus).extend({
    name: 'default',
    mounted() {
        this.$store.commit(
            MutationType.PREFERS_REDUCED_MOTION,
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
    },
    beforeDestroy() {
        this.$el.removeEventListener('transitionend', this.onTransitionEnd)
    },
    computed: {
        rootClasses(): (string | false | undefined)[] {
            return [
                this.$style.root,
                this.isProjectExpanded && this.$style['root--project-expanded'],
                this.isSettingOpen && this.$style['root--setting-open'],
                ...this.splashScreenClasses,
            ]
        },
        isProjectExpanded() {
            return this.$store.state.isProjectExpanded
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
        isSettingOpen() {
            return this.$store.state.isSettingsOpen
        },
        isAboutOpen() {
            return this.$store.state.isAboutOpen as boolean
        },
        isBodyContentInert(): boolean {
            return this.isAboutOpen || this.isProjectExpanded
        },
    },
    watch: {
        $route(current: Route, previous) {
            const isProjectSwitching =
                this.$store.getters.isProjectUid(current.params.pathMatch) &&
                this.$store.getters.isProjectUid(previous.params.pathMatch)

            this.$route.fullPath === '/' && this.$store.commit(MutationType.IS_PROJECT_EXPANDED, false)
            isProjectSwitching && this.$refs.project.scrollTo({ top: 0, behavior: 'smooth' })
        },
        isSettingOpen(value: boolean) {
            if (!value) return
            this.$el.addEventListener('transitionend', this.onTransitionEnd, { once: true })
        },
    },
    methods: {
        onTransitionEnd() {
            eventBus.$emit(EventType.SETTING_TRANSITION_END)
            this.$el.removeEventListener('transitionend', this.onTransitionEnd)
        },
        onBodyClick(_event: Event) {
            this.isProjectExpanded && this.$router.push('/')
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
    position: relative;
    display: flex;
    overflow: hidden;
    height: 100vh;
    background-color: var(--theme-background-color);
    color: var(--theme-foreground-color);

    &--splash-screen-displayed {
        overflow: hidden;
    }

    &--project-expanded {
        /* !keep */
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

    &::before {
        position: absolute;
        z-index: 109;
        background-color: color(black);
        content: '';
        inset: 0;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.7s ease(out-quad);
    }

    .root--project-expanded &::before {
        opacity: 0.8;
    }

    .root--project-expanded & {
        cursor: pointer;
    }
}

.project {
    position: relative;
    z-index: 110;
    min-width: 50%;
    border-left: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
    transition: min-width 0.7s ease(out-quad), translate 0.7s ease(out-quad);
    translate: 0 0;

    .root--project-expanded & {
        right: 0;
        min-width: 85%;
        translate: -35vw 0;
    }
}
</style>
