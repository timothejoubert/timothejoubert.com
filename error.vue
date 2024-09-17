<script setup lang="ts">
import type { NuxtError } from 'nuxt/app'

useSeoMeta({ robots: 'noindex, nofollow' })

const props = defineProps<{
    error: NuxtError
}>()

const { t } = useI18n()

const statusCode = computed(() => props.error?.statusCode)

const title = computed(() => {
    if (statusCode.value === 404) {
        return t('error_page.not_found.title')
    }

    if (statusCode.value === 401) return t('error_page.unauthenticated_user_error')

    if (statusCode.value === 403) return t('error_page.unauthorized_access_error')

    if (statusCode.value === 500 || statusCode.value === 501 || statusCode.value === 502) {
        return t('error_page.title', { code: statusCode.value })
    }

    return t('error_page.unknown_error')
})

const message = computed(() => {
    if (statusCode.value === 404) return t('error_page.not_found.body')
    return t('error_page.body')
})

onMounted(() => {
    // force reload if navigation occurs
    const router = useRouter()
    const unwatchRouter = router.afterEach(() => {
        unwatchRouter()

        // reload
        window.history.go(0)
    })
})

// Log the error for debugging purposes
console.error('Error page:', props.error)
</script>

<template>
    <div>Error page: {{ title }}</div>
    <div>{{ message }}</div>
    <pre>{{ error }}</pre>
</template>

<!-- <style lang="scss" module></style> -->
