<template>
    <div :class="rootClasses" class="container">
        <v-about-toggle />
        <transition name="about-content" @after-enter="onAfterEnter">
            <v-about-content v-if="isAboutOpen" :inert="!isAboutOpen" />
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import eventBus from '~/utils/event-bus'
import EventType from '~/constants/event-type'

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
    methods: {
        onAfterEnter() {
            eventBus.$emit(EventType.ABOUT_TRANSITION_ENTERED)
        },
    },
})
</script>
<style lang="scss" module>
@include v-transition(
    'about-content',
    (
        duration: 0.7s,
    ),
    (
        opacity: 0,
        translate: 0 rem(60),
    ),
    $scope: 'local'
);
.root {
    position: sticky;
    bottom: 0;
    min-height: $v-about-toggle-height;
    max-height: calc(100vh - $v-top-bar-height);
    border-top: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
    -ms-overflow-style: none; /* IE and Edge */
    overflow-y: scroll;
    overscroll-behavior: contain;
    scrollbar-width: none; /* Firefox */
    transition: min-height 0.8s ease(out-quad);

    &::-webkit-scrollbar {
        display: none;
    }

    &--open {
        min-height: calc(100vh - $v-top-bar-height);
    }
}
</style>
