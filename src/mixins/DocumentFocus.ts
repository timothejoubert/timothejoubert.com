import Vue from 'vue'

export default Vue.extend({
    data() {
        return {
            isDocumentFocused: null as null | boolean,
        }
    },
    mounted() {
        document.addEventListener('visibilitychange', this.handleVisibilityChange)
    },
    beforeDestroy() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    },
    methods: {
        handleVisibilityChange() {
            if (document.visibilityState === 'visible') {
                window.setTimeout(() => {
                    this.isDocumentFocused = true
                }, 1700)
            } else {
                this.isDocumentFocused = false
            }
        },
    },
})
