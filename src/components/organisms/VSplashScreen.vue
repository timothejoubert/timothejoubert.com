<template>
    <transition :name="$style.root">
        <v-splash-screen-content v-if="splashScreenState !== 'done'" v-model="splashScreenState" />
    </transition>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import MutationType from '~/constants/mutation-type'
import DocumentFocus from '~/mixins/DocumentFocus'

export type SplashScreenState = 'pending' | 'appear' | 'animating' | 'beforeLeave' | 'leave' | 'done'

export default mixins(DocumentFocus).extend({
    name: 'VSplashScreen',
    data() {
        return {
            splashScreenState: 'pending' as SplashScreenState,
        }
    },
    watch: {
        splashScreenState(state: SplashScreenState) {
            if (state === 'done') this.onSplashScreenDone()
        },
        isDocumentFocused(value: boolean) {
            if (value && this.splashScreenState === 'pending') this.startAnimation()
        },
    },
    mounted() {
        this.isDocumentFocused && this.startAnimation()
    },
    methods: {
        onSplashScreenDone() {
            this.$store.commit(MutationType.SPLASH_SCREEN_DONE, true)
        },
        startAnimation() {
            this.splashScreenState = 'appear'
        },
    },
})
</script>

<style lang="scss" module>
.root {
    &:global(#{'-enter-active'}) {
        transition: opacity 0.65s ease(out-quad);
    }

    &:global(#{'-leave-active'}) {
        transition: opacity 0.4s ease(in-quad);
    }

    &:global(#{'-enter'}),
    &:global(#{'-leave-to'}) {
        opacity: 0;
    }
}
</style>
