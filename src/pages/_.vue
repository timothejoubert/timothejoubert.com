<template>
    <v-project v-if="isProjectPage">
        <!-- eslint-disable-next-line vue/no-v-html-->
        <template #jsonLdPage>
            <script v-if="jsonLdPage" type="application/ld+json" v-html="jsonLdPage"></script>
        </template>
    </v-project>
    <!-- <slice-zone v-if="slices && components" wrapper="main" :slices="slices" :components="components" />-->
    <!-- <v-style-preview />-->
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import { SliceZone } from '@prismicio/vue/src/components/SliceZone'
import { components } from '~~/slices'
import Page from '~/mixins/Page'

export default mixins(Page).extend({
    name: 'DefaultPage',
    components: { SliceZone },
    data() {
        return { components }
    },
    mounted() {
        window.addEventListener('keyup', this.onKeyUp)
    },
    beforeDestroy() {
        window.removeEventListener('keyup', this.onKeyUp)
    },
    methods: {
        onKeyUp(event: KeyboardEvent) {
            if (event.key === 'Escape' || event.keyCode === 27) this.$router.push({ path: '/' })
        },
    },
})
</script>
