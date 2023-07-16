<template>
    <transition :name="$style.root">
        <v-splash-screen v-if="splashScreenState !== 'done'" v-model="splashScreenState" />
    </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'

export type SplashScreenState = 'pending' | 'appear' | 'animating' | 'leave' | 'done'

export default Vue.extend({
    name: 'VSplashScreenWrapper',
    data() {
        return {
            splashScreenState: 'pending' as SplashScreenState,
        }
    },
    watch: {
        splashScreenState(state: SplashScreenState) {
            if (state === 'done') this.onSplashScreenDone()
        },
    },
    mounted() {
        this.splashScreenState = 'appear'
    },
    methods: {
        onSplashScreenDone() {
            this.$store.commit(MutationType.SPLASH_SCREEN_DONE, true)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        transition: opacity 0.65s ease(out-quad);
    }

    &:global(#{'-enter'}),
    &:global(#{'-leave-to'}) {
        opacity: 0;
    }
}
</style>
