<template>
    <div :class="rootClasses" class="container">
        <v-about-toggle />
        <!--        <transition :name="$style['about-content']" @after-enter="onAfterEnter">-->
        <transition name="about-content" @after-enter="onAfterEnter">
            <div v-if="isAboutOpen" :class="$style.wrapper" :inert="!isAboutOpen">
                <v-about-content />
            </div>
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
.root {
    @include hide-scrollbar;

    position: sticky;
    bottom: 0;
    min-height: $v-about-toggle-height;
    max-height: calc(100vh - $v-top-bar-height);
    border-top: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
    transition: min-height 0.8s ease(out-quad);

    &--open {
        min-height: calc(100vh - $v-top-bar-height);
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
