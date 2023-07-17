<template>
    <transition :name="$style.root">
        <v-splash-screen v-if="splashScreenState !== 'done'" v-model="splashScreenState" />
    </transition>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import MutationType from '~/constants/mutation-type'
import DocumentFocus from '~/mixins/DocumentFocus'

export type SplashScreenState = 'pending' | 'appear' | 'animating' | 'leave' | 'done'

export default mixins(DocumentFocus).extend({
    name: 'VSplashWrapper',
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
