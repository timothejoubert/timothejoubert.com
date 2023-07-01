import Vue from 'vue'
import type { PropType } from 'vue'
import { Theme } from '~/types/app'

export default Vue.extend({
    props: {
        theme: {
            type: [String, Boolean] as PropType<Theme | false>,
            default: 'orange',
        },
    },
})
