import Vue from 'vue'
import toBoolean from '~/utils/to-boolean'
import GeneralsConst from '~/constants/app'
import MutationType from '~/constants/mutation-type'

const SESSION_STORAGE_KEY = 'hugo-tomasi-visited'

export default Vue.extend({
    data() {
        return {
            isAlreadyRegister: false,
        }
    },
    computed: {
        splashScreenClasses(): (string | false | undefined)[] {
            return [
                this.isSplashScreenDisplayed &&
                    !this.isSplashScreenDone &&
                    this.$style['root--splash-screen-displayed'],
            ]
        },
        displayOnce(): boolean {
            return toBoolean(GeneralsConst.DISPLAY_SPLASH_SCREEN_ONCE)
        },
        isSplashScreenDisplayed(): boolean {
            const isDisplayedOnlyOnFirstTime = !this.displayOnce || (this.displayOnce && !this.isAlreadyRegister)
            return toBoolean(GeneralsConst.DISPLAY_SPLASH_SCREEN) && isDisplayedOnlyOnFirstTime
        },
        isSplashScreenDone(): boolean {
            return this.$store.state.splashScreenDone
        },
    },
    watch: {
        isSplashScreenDone(isDone: boolean) {
            if (this.isSplashScreenDisplayed && isDone && this.displayOnce)
                sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
        },
    },
    mounted() {
        this.isSplashScreenRegister()
        this.isReady()
    },
    methods: {
        isSplashScreenRegister() {
            this.isAlreadyRegister = toBoolean(sessionStorage.getItem(SESSION_STORAGE_KEY))
        },
        isReady() {
            if (
                (this.displayOnce && this.isAlreadyRegister) ||
                (this.isSplashScreenDisplayed && this.isSplashScreenDone)
            ) {
                this.$store.commit(MutationType.SPLASH_SCREEN_DONE, true)
            }
        },
    },
})
