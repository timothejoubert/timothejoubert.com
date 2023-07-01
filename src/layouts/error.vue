<template>
    <section :class="$style.root">
        <div>
            <h1>## Page error ## 🤦‍ Probablement une {{ error.statusCode }}...️</h1>
            <h2>{{error.path}}</h2>
        </div>
        <p>{{ error.message }}</p>
    </section>
</template>

<script lang="ts">
import Vue from 'vue'
import type {PropType} from 'vue'
import {NuxtError} from "@nuxt/types";

export default Vue.extend({
    layout: 'error',
    props: {
        error: Object as PropType<NuxtError>,
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    max-width: rem(800);
    min-height: calc(100vh - rem(68 + 28));
    margin-inline: auto;
    padding-block: rem(200);
}
</style>
