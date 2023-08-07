<template>
    <div :class="rootClasses" :style="colorThemeStyle">
        <client-only>
            <transition name="fade">
                <v-blur-screen v-if="isSplashScreenDone && isDocumentFocused === false" />
            </transition>
        </client-only>

        <div
            :class="[$style.body, isProjectOpen && $style['body--minify']]"
            :style="{ '--v-setting-height': settingHeight }"
        >
            <v-splash-screen v-if="isSplashScreenEnabled" />

            <v-top-bar />
            <v-setting ref="setting" :class="$style.setting" :inert="!isSettingOpen" />
            <v-project-list :class="$style['project-listing']" :inert="isAboutOpen" />
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
import Vue from 'vue'
import type { VueConstructor } from 'vue'
import Resize from '~/mixins/Resize'
import MutationType from '~/constants/mutation-type'
import SplashScreen from '~/mixins/SplashScreen'
import DocumentFocus from '~/mixins/DocumentFocus'
import eventBus from '~/utils/event-bus'
import EventType from '~/constants/event-type'

interface Component extends Vue {
    resizeObserver: ResizeObserver
}

export default mixins(Resize, SplashScreen, DocumentFocus, Vue as VueConstructor<Component>).extend({
    name: 'default',
    data() {
        return {
            settingHeight: null as null | string,
        }
    },
    mounted() {
        this.$store.commit(
            MutationType.PREFERS_REDUCED_MOTION,
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )

        this.setSettingHeight()
        this.initResizeObserver()
    },
    beforeDestroy() {
        this.resizeObserver.disconnect()
        this.$el.removeEventListener('transitionend', this.onTransitionEnd)
    },
    computed: {
        rootClasses(): (string | false | undefined)[] {
            return [
                this.$style.root,
                this.isSettingOpen && this.$style['root--setting-open'],
                ...this.splashScreenClasses,
            ]
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
            return this.$store.state.isAboutOpen
        },
    },
    watch: {
        $route(current: Route, previous) {
            const isProjectSwitching =
                this.$store.getters.isProjectUid(current.params.pathMatch) &&
                this.$store.getters.isProjectUid(previous.params.pathMatch)

            isProjectSwitching && this.$refs.project.scrollTo({ top: 0, behavior: 'smooth' })
        },
        isSettingOpen(value: boolean) {
            if (!value) return
            this.$el.addEventListener('transitionend', this.onTransitionEnd, { once: true })
        },
    },
    methods: {
        initResizeObserver() {
            const setting = this.$refs.setting.$el as HTMLElement

            this.resizeObserver = new ResizeObserver(this.setSettingHeight)
            this.resizeObserver.observe(setting)
        },
        setSettingHeight() {
            const setting = this.$refs.setting.$el as HTMLElement
            this.settingHeight = setting.offsetHeight + 'px'
        },
        onTransitionEnd() {
            eventBus.$emit(EventType.SETTING_TRANSITION_END)
            this.$el.removeEventListener('transitionend', this.onTransitionEnd)
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
    height: 100vh;
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

.setting {
    position: sticky;
    z-index: 11;
    top: $v-top-bar-height;
    transition: translate 0.4s ease(out-quad);

    .root:not(.root--setting-open) & {
        translate: 0 calc(var(--v-setting-height) * -1);
    }
}

.project-listing {
    position: relative;
    min-height: calc(100vh - $v-top-bar-height - $v-about-toggle-height);
    /* stylelint-disable-next-line property-no-unknown */
    container-type: inline-size;
    transition: translate 0.4s ease(out-quad);

    .root:not(.root--setting-open) & {
        translate: 0 calc(var(--v-setting-height) * -1);
        min-height: calc(100vh - $v-top-bar-height - $v-about-toggle-height - var(--v-setting-height));
    }
}

.project {
    position: relative;
    min-width: 50%;
    border-left: 1px solid var(--theme-foreground-color);
}
</style>
