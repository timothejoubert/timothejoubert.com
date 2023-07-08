<template>
    <button
        :class="$style.root"
        :aria-label="`${isOpen ? 'Close' : 'Open'} options panel`"
        type="button"
        role="switch"
        :aria-checked="isOpen.toString()"
        @click="toggleSettings"
    >
        <svg :class="$style.svg" viewBox="0 0 28 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" width="2" height="20" rx="1" :class="$style.rect" />
            <rect x="13" width="2" height="20" rx="1" :class="$style.rect" />
            <rect x="22" width="2" height="20" rx="1" :class="$style.rect" />
            <circle cx="5" cy="13" r="3" :class="$style.circle" />
            <circle cx="23" cy="13" r="3" :class="$style.circle" />
            <circle cx="14" cy="8" r="3" :class="[$style.circle, $style['circle--center']]" />
        </svg>
    </button>
</template>

<script lang="ts">
import Vue from 'vue'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VToggleSettings',
    computed: {
        isOpen(): boolean {
            return this.$store.state.isSettingsOpen
        },
    },
    methods: {
        toggleSettings() {
            const isAboutOpen = this.$store.state.isAboutOpen
            if (isAboutOpen) this.$store.commit(MutationType.ABOUT_OPENED, false)
            this.$store.commit(MutationType.SETTING_OPENED, !this.isOpen)
        },
    },
})
</script>
<style lang="scss" module>
.root {
    width: rem(26);
}

.svg {
    width: 100%;
    height: auto;
}

.rect,
.circle {
    fill: var(--color-main);
}
.circle {
    stroke: var(--color-bg);
    transition: transform 0.3s ease(out-quint);

    .root:hover & {
        transform: translateY(-20%);
    }

    .root:hover &--center {
        transform: translateY(30%);
    }
}
</style>
