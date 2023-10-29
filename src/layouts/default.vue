<template>
    <div :class="rootClasses" :style="colorThemeStyle">
        <client-only>
            <transition name="fade">
                <v-blur-screen v-if="isSplashScreenDone && isDocumentFocused === false" />
            </transition>
        </client-only>

        <div id="main" :class="[$style.body, isProjectOpen && $style['body--minify']]" @click="onBodyClick">
            <v-splash-screen v-if="isSplashScreenEnabled" />
            <v-top-bar :class="$style['top-bar']" />

            <v-favorite-setting :inert="isBodyContentInert" />
            <v-favorite-project-list :inert="isBodyContentInert" />

            <v-archive v-if="displayArchive" :inert="isBodyContentInert" />

            <!--            <v-statistics />-->

            <Nuxt v-if="isHomePage" />
            <v-about :class="$style.footer" />
        </div>
        <transition :name="$style['project-modal']">
            <div v-if="isProjectOpen" ref="project" :class="$style.project">
                <Nuxt />
            </div>
        </transition>

        <script v-if="isHomePage" type="application/ld+json" v-html="jsonLdHome"></script>
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
import toBoolean from '~/utils/to-boolean'
import AppConst from '~/constants/app'
import { SettingsDocument } from '~~/prismicio-types'
import { getJsonLdData, getJsonLdProjectList } from '~/utils/jsonLd'

const DEBUG_INPUT_ENTER = 'admin'
const DEBUG_INPUT_LEAVE = 'quit'

export default mixins(Resize, SplashScreen, DocumentFocus).extend({
    name: 'default',
    data() {
        return {
            typedKey: '',
            bodyScrollTop: 0,
        }
    },
    mounted() {
        this.$store.commit(
            MutationType.PREFERS_REDUCED_MOTION,
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        )
        console.info(
            `%cWrite '${DEBUG_INPUT_ENTER}' when focusing the window to launch debug mode and '${DEBUG_INPUT_LEAVE}' for leave`,
            'color: yellow; background: black'
        )
        window.addEventListener('keyup', this.onKeyUp)
    },
    beforeDestroy() {
        this.$el.removeEventListener('transitionend', this.onTransitionEnd)
        window.removeEventListener('keyup', this.onKeyUp)
    },
    computed: {
        jsonLdHome(): Record<string, unknown> {
            const siteName =
                (this.$store.getters.settings as SettingsDocument)?.data?.website_name || this.$config.appName

            const data = getJsonLdData({
                document: this.$store.state.currentPageData,
                siteName,
                baseUrl: this.$config.appUrl,
                websiteSettings: this.$store.getters.settings,
            })

            const displayedProject = this.displayArchive
                ? this.$store.getters.projects
                : this.$store.getters.highlightedProjects

            return {
                ...data,
                hasPart: getJsonLdProjectList(displayedProject),
            }
        },
        rootClasses(): (string | false | undefined)[] {
            return [
                this.$style.root,
                this.isProjectExpanded && this.$style['root--project-expanded'],
                this.isSettingOpen && this.$style['root--setting-open'],
                ...this.splashScreenClasses,
            ]
        },
        displayArchive(): boolean {
            return toBoolean(AppConst.DISPLAY_ARCHIVE) || this.$store.state.isEveryProjectInFavorite
        },
        isProjectExpanded() {
            return this.$store.state.isProjectExpanded
        },
        isProjectOpen(): boolean {
            return this.$store.getters.isProjectOpen || !!(this.$nuxt as any)?.nuxt?.err
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
            isProjectSwitching && this.$refs.project?.scrollTo({ top: 0, behavior: 'smooth' })
        },
        isSettingOpen(value: boolean) {
            if (!value) return
            this.$el.addEventListener('transitionend', this.onTransitionEnd, { once: true })
        },
    },
    methods: {
        onKeyUp(e: KeyboardEvent) {
            this.typedKey += e.key

            const debugMode = this.typedKey.includes(DEBUG_INPUT_ENTER)
                ? 'on'
                : this.typedKey.includes(DEBUG_INPUT_LEAVE)
                ? 'off'
                : null

            if (debugMode) {
                this.$store.commit(MutationType.IS_EVERY_PROJECT_IN_FAVORITE, debugMode === 'on')
                this.typedKey = ''
                console.info(
                    `%cDebug mode: ${debugMode === 'on' ? 'enable' : 'disable'}`,
                    'color: black; background: yellow'
                )
            }
        },
        onTransitionEnd() {
            eventBus.$emit(EventType.SETTING_TRANSITION_END)
            this.$el.removeEventListener('transitionend', this.onTransitionEnd)
        },
        onBodyClick(_event: Event) {
            this.isProjectExpanded && this.$router.push('/')
        },
        onBeforeProjectEnter() {
            // this.toggleBodyPosition('absolute')
        },
        onBeforeProjectLeave() {
            // this.toggleBodyPosition('initial')
        },
        // toggleBodyPosition(position: string) {
        // const body = this.$refs.body as HTMLElement
        // this.bodyScrollTop = body.scrollTop

        // body.style.position = position
        // body.scrollTop = this.bodyScrollTop
        // },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    background-color: var(--theme-background-color);
    color: var(--theme-foreground-color);

    &--splash-screen-displayed {
        overflow: hidden;
    }

    @include media('>=lg') {
        overflow: hidden;
        height: 100vh;
    }
}

.body,
.project {
    @include scroll-bar-hidden;
}

@function expanded-project-transition($property) {
    @return $property 0.8s ease(out-quad);
}

.body {
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    //overflow: hidden;
    flex-shrink: 0;
    transition: expanded-project-transition(width);

    &::before {
        position: absolute;
        z-index: 109;
        background-color: color(black);
        content: '';
        inset: 0;
        opacity: 0;
        pointer-events: none;
        transition: expanded-project-transition(opacity);
    }

    .root--project-expanded &::before {
        opacity: 0.8;
    }

    .root--project-expanded & {
        cursor: pointer;
    }

    @include media('<lg') {
        &::before {
            top: $v-top-bar-height;
        }

        &--minify::before {
            opacity: 0.8;
        }
    }

    @include media('>=lg') {
        &--minify {
            width: 50%;
        }
    }
}

.top-bar {
    position: relative;
    flex-shrink: 0;

    @include media('>=sm') {
        position: sticky;
    }
}

.footer {
    margin-top: auto;

    &::after {
        position: absolute;
        z-index: -1;
        background-color: var(--theme-background-color);
        content: '';
        inset: 0 calc(var(--section-padding) * -1);
    }

    @include media('<lg') {
        position: fixed !important;
        z-index: 111 !important;
        left: var(--section-padding);
    }
}

.project {
    position: absolute;
    z-index: 110;
    //top: $v-top-bar-height;
    width: 100%;
    background-color: var(--theme-background-color);
    translate: 0 0;

    @include media('>=lg') {
        position: relative;
        //top: initial;
        right: 0;
        min-width: 50%;
        border-left: 1px solid var(--theme-foreground-color);
        transform-origin: center right;
        transition: expanded-project-transition(min-width), expanded-project-transition(translate);
        translate: 0 0;

        .root--project-expanded & {
            min-width: 85%;
            translate: -35vw 0;
        }
    }
}

.project-modal {
    @include media('<lg') {
        &:global(#{'-enter-active'}),
        &:global(#{'-leave-active'}) {
            transition: translate 0.9s ease(out-quad);
        }

        &:global(#{'-enter'}),
        &:global(#{'-enter-from'}),
        &:global(#{'-leave-to'}) {
            /* stylelint-disable-next-line unit-no-unknown */
            translate: 0 100dvh;
        }
    }
}
</style>
