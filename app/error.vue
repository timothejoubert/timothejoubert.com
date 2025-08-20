<script setup lang="ts">
import type { NuxtError } from 'nuxt/app'

const { error } = defineProps<{
    error: NuxtError
}>()

const { t } = useI18n()

const isServerError = computed(() => String(error.statusCode)?.startsWith('5')) // 50x errors
const title = computed(() => {
    if (error.statusCode === 404) {
        return t('error_page.not_found_title')
    }

    if (error.statusCode === 401) return t('error_page.unauthenticated_user_error_title')

    if (error.statusCode === 403) return t('error_page.unauthorized_access_error_title')

    if (isServerError.value) return t('error_page.server_error_title')

    return t('error_page.fallback_title')
})

const subtitle = computed(() => t('error_status', { code: error.statusCode }))
const content = computed(() => {
    if (error.statusCode === 404) return t('error_page.not_found_content')
    else if (isServerError.value) return t('error_page.server_error_content')

    return t('error_page.content')
})

useHead({
    title: title.value,
})

function goToHome() {
    clearError({ redirect: '/' })
}
</script>

<template>
   <div>
        <h1>{{ title }}</h1>
        <h2> {{ subtitle }}</h2>
        <p>{{ content }}</p>
        <pre>{{ error.message }}</pre>
        <button v-if="isServerError" onclick="window.location.reload()">{{ $t('refresh') }}</button>
        <button v-else @click="goToHome">{{ $t('back_home') }}</button>
        <VNav />
    </div>
</template>

<style lang="scss" module>
</style>
