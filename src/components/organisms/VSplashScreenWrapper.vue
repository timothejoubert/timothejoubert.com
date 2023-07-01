<template>
    <transition :name="$style['splash-screen']">
        <v-splash-screen v-if="splashScreenState !== 'done'" v-model="splashScreenState" />
    </transition>
</template>

<script lang="ts">
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'

export type SplashScreenState = 'pending' | 'beforeEnter' | 'beforeLeaved' | 'leave' | 'done'

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
        this.splashScreenState = 'beforeEnter'
    },
    methods: {
        onSplashScreenDone() {
            this.$store.commit(MutationType.SPLASH_SCREEN_DONE, true)
        },
    },
})
</script>

<style lang="scss" module>
.splash-screen:global(#{'-enter-active'}),
.splash-screen:global(#{'-leave-active'}) {
    transition: opacity 0.3s;
}

.splash-screen:global(#{'-enter'}),
.splash-screen:global(#{'-leave-to'}) {
    opacity: 0;
}
</style>
