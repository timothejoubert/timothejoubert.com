<template>
    <div v-if="pageData">
        <slice-zone v-if="slices && components" wrapper="main" :slices="slices" :components="components" />

        <v-style-preview />

        <!-- eslint-disable-next-line vue/no-v-html -->
        <script v-if="jsonLd" type="application/ld+json" v-html="jsonLd"></script>
    </div>
    <div v-else>
        <p>pageData not find</p>
    </div>
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
})
</script>

<style lang="scss" module>
.project-page-carousel {
    @include margin-block;
}
</style>
