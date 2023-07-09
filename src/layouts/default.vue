<template>
    <div :class="rootClasses">
        <div :class="$style.body">
            <v-splash-screen-wrapper v-if="isSplashScreenDisplayed" />
            <v-top-bar />
            <v-main />
            <nuxt v-if="isHomePage" />
            <v-about />
        </div>
        <transition :name="$style['project-modal']">
            <div v-if="isProjectOpen" :class="$style.project">
                <Nuxt />
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import Resize from '~/mixins/Resize'
import MutationType from '~/constants/mutation-type'
import SplashScreen from '~/mixins/SplashScreen'
import CustomType from '~/constants/custom-type'

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
        isProjectOpen(): boolean {
            return this.$store.state.currentPageData?.type === CustomType.PROJECT
        },
        isHomePage() {
            return this.$store.getters.isHomePage
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
        translate: -100% 0,
    )
);

.root {
    @include theme(dark);

    position: relative;
    display: flex;
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
    -ms-overflow-style: none; /* IE and Edge */
    overflow-y: scroll;
    overscroll-behavior: contain;
    scrollbar-width: none; /* Firefox */

    &::-webkit-scrollbar {
        display: none;
    }
}

.project {
    position: relative;
    min-width: 50%;
    border-left: 1px solid var(--theme-foreground-color);
}
</style>
