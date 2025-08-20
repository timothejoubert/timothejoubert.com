<script lang="ts" setup>
const links = [
	{ label: 'Home', url: '/' },
	{ label: 'Archive', url: '/archive' },
	{ label: 'About', url: '/a-propos' },
	{ label: 'Other', url: '/other' },
]
</script>

<template>
    <nav :aria-label="$t('main_nav')">
        <ul>
            <li
                v-for="link in links"
                :key="link.url"
            >
                <slot
                    :url="link.url"
                    :label="link.label"
                >
                    <NuxtLink :to="link.url">{{ link.label }}</NuxtLink>
                </slot>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" module>
</style>
