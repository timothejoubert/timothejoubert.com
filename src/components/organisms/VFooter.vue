<template>
    <footer :class="$style.root" class="container">
        <div class="text-body-xs" :class="$style.copyright">
            © {{ siteName }} | {{ currentYear }}
            <div :class="$style.creator">
                <span>{{ $t('created_by') }}</span>
                <a href="https://timothejoubert.com" target="_blank">Timothé J.</a>
            </div>
        </div>
        <v-social-list-link />
    </footer>
</template>
<script lang="ts">
import Vue from 'vue'
import { SettingsData } from '~/types/prismic/app-prismic'

export default Vue.extend({
    computed: {
        settingsData(): SettingsData {
            return this.$store.state.settings?.data || { data: null }
        },
        siteName(): string | null {
            return this.settingsData?.website_name
        },
        currentYear(): number {
            return new Date().getFullYear()
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    justify-content: space-between;
    background-color: color(black);
    border-radius: rem(16);
    color: color(white);
    padding-inline: rem(32);
}

.copyright {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    @include media('>=xs') {
        flex-direction: row;
    }
}

.creator {
    margin-top: rem(6);

    & > * {
        opacity: 0.7;
    }

    & > *:first-child {
        margin-left: rem(18);
    }

    & > a {
        transition: opacity 0.3s;
    }

    & > a:hover {
        opacity: 1;
    }

    @include media('>=xs') {
        margin-top: 0;
    }
}
</style>
