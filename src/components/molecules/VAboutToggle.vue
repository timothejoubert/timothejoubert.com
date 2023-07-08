<template>
    <div :class="$style.root">
        <button :class="$style['about-link']" aria-label="Ouvrir la section about" @click="onClick">
            <span v-if="title" :class="[$style.title, 'body-s']">{{ title }}</span>
            <span :class="[$style.icon, isAboutOpen && $style['icon--open']]">
                <span :class="$style['circle-outlined']"></span>
                <span :class="$style['circle-filled']"></span>
                <icon-arrow :class="$style.arrow" />
                <icon-cross :class="$style.cross" />
            </span>
        </button>
        <v-social-list-link :class="$style.socials" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconArrow from '~/assets/images/icons/arrow.svg?sprite'
import IconCross from '~/assets/images/icons/cross.svg?sprite'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VAboutToggle',
    components: { IconArrow, IconCross },
    computed: {
        title(): string {
            return this.$store.getters.settings?.data?.website_name
        },
        isAboutOpen(): boolean {
            return false
        },
    },
    methods: {
        onClick() {
            const currentState = this.$store.state.isAboutOpen
            this.$store.commit(MutationType.ABOUT_OPENED, !currentState)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    height: $v-about-toggle-height;
    align-items: center;
    justify-content: center;
}

.socials {
    position: absolute;
    right: 0;
}
</style>
