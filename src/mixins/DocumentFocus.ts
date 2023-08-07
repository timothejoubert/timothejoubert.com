import Vue from 'vue'

export default Vue.extend({
    data() {
        return {
            isDocumentFocused: null as null | boolean,
        }
    },
    mounted() {
        this.isDocumentFocused = document.visibilityState === 'visible'
        document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
    },
    beforeDestroy() {
        document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    },
    methods: {
        handleVisibilityChange() {
            if (document.visibilityState === 'hidden') {
                this.isDocumentFocused = false
            } else {
                window.setTimeout(() => {
                    this.isDocumentFocused = true
                }, 1700)
            }
        },
    },
})
