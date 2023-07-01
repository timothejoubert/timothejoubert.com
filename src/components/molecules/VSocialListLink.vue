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
            <component :is="social.tagIcon" v-else />
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
    gap: rem(10);
}

.link {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.3s;

    @media (hover: hover) {
        &:hover {
            opacity: 1;
        }
    }
}
</style>
