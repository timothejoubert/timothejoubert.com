<template>
    <div :class="rootClasses" class="container">
        <v-about-toggle />
        <transition name="about-content" @after-enter="onAfterEnter">
            <div v-show="isAboutOpen" :class="$style.wrapper" :inert="!isAboutOpen">
                <v-about-content />
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import eventBus from '~/utils/event-bus'
import EventType from '~/constants/event-type'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VAbout',
    computed: {
        rootClasses(): (undefined | false | string)[] {
            return [this.$style.root, this.isAboutOpen && this.$style['root--open']]
        },
        commonContent() {
            return this.$store.state
        },
        isAboutOpen() {
            return this.$store.state.isAboutOpen
        },
    },
    watch: {
        isAboutOpen(value: boolean) {
            if (value) window.addEventListener('keyup', this.onKeyUp)
            else window.removeEventListener('keyup', this.onKeyUp)
        },
    },
    methods: {
        onAfterEnter() {
            eventBus.$emit(EventType.ABOUT_TRANSITION_ENTERED)
        },
        onKeyUp(event: KeyboardEvent) {
            if (event.key === 'Escape' || event.keyCode === 27) this.$store.commit(MutationType.ABOUT_OPENED, false)
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: sticky;
    z-index: 11;
    bottom: 0;
    min-height: $v-about-toggle-height;
    max-height: 100vh !important;
    background-color: var(--theme-background-color);
    transition: min-height 0.85s ease(out-quad);

    &--open {
        @include scroll-bar-hidden;

        min-height: calc(100vh + 2px) !important;
        overflow-x: hidden;
    }

    @include media('>=md') {
        max-height: calc(100vh - $v-top-bar-height) !important;

        &--open {
            min-height: calc(100vh - $v-top-bar-height);
        }
    }
}

.wrapper {
    width: 100%;
}

@include v-transition(
    'about-content',
    $transitionOptions: (duration: 0.9s, delay: 0.2s),
    $properties: (opacity: 0, translate: 0 rem(60)),
    $activeProperties: (position: absolute),
    $scope: 'local'
);
</style>
