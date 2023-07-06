<template>
    <div :class="$style.root" class="container">
        <button :class="$style['about-link']" aria-label="button-toggle-about" @click="onClick">
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
            console.log('click')
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: fixed;
    z-index: 2;
    right: $container-padding-inline;
    bottom: 0;
    left: $container-padding-inline;
    display: flex;
    height: rem(60);
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--theme-foreground-color);
    background-color: var(--theme-background-color);
}

.socials {
    position: absolute;
    right: 0;
}
</style>
