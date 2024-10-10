<script  lang="ts" setup>
const router = useRouter()
const pages = computed(() => {
    return router.options.routes
})
</script>

<template>
    <nav :class="$style.root">
        <ul>
            <li
                v-for="page in pages"
                :key="page.path"
            >
                <NuxtLink :to="page.path">
                    {{ page }}
                </NuxtLink>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" module>
.root {
}
</style>
