<template>
    <v-social-list v-slot="{ socials }" :class="$style.root">
        <a
            v-for="(social, i) in socials"
            :key="'social-' + i"
            :class="$style.link"
            :href="social.url"
            target="_blank"
            :title="social.name"
        >
            <span v-if="social.label">{{ social.label }}</span>
            <component :is="social.tagIcon" v-else :class="$style.icon" />
        </a>
    </v-social-list>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VSocialListLink',
})
</script>

<style lang="scss" module>
.root {
    display: flex;
    gap: rem(18);
    padding-inline: rem(6);
}

.link {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--theme-foreground-color);

    &::before {
        position: absolute;
        width: rem(30);
        height: rem(30);
        background-color: var(--theme-foreground-color);
        border-radius: 100%;
        content: '';
        opacity: 0.08;
        transition: scale 0.3s;
    }

    @media (hover: hover) {
        &:hover::before {
            scale: 0.9;
        }
    }
}

.icon {
    width: rem(20);
    height: auto;
    opacity: 0.6;
    transition: opacity 0.3s;

    @media (hover: hover) {
        .link:hover & {
            opacity: 1;
        }
    }
}
</style>
