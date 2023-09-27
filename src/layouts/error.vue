<template>
    <v-no-result
        :class="$style.root"
        :title="title"
        :sub-title="subTitle"
        button-label="Retour à l'accueil"
        @reset-filter="onClick"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { NuxtError } from '@nuxt/types'

export default Vue.extend({
    layout: 'error',
    props: {
        error: Object as PropType<NuxtError>,
    },
    computed: {
        title() {
            const status = this.error?.statusCode
            return status ? status.toString() : '## Erreur ##'
        },
        subTitle() {
            return this.error?.message || "J'vais me reconvertir de toute façon"
        },
    },
    methods: {
        onClick() {
            this.$router.push('/')
        },
    },
})
</script>

<style lang="scss" module>
.root {
    --v-no-result-min-height: 100vh;
}
</style>
