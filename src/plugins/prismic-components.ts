import Vue from 'vue'
import { SliceZone } from '@prismicio/vue/src/components/SliceZone'
import PrismicRichText from '@prismicio/vue/src/components/RichText'
import PrismicImage from '@prismicio/vue/src/components/Image'

const components = { PrismicImage, PrismicRichText, SliceZone }

Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
})
