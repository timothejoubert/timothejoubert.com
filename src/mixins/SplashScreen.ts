import Vue from 'vue'
import toBoolean from '~/utils/to-boolean'
import AppConst from '~/constants/app'
import MutationType from '~/constants/mutation-type'

export const STORAGE_KEY = 'timothe-joubert-visited'

export default Vue.extend({
    data() {
        return {
            isAlreadyRegister: false,
        }
    },
    computed: {
        splashScreenClasses(): (string | false | undefined)[] {
            return [
                this.isSplashScreenEnabled && !this.isSplashScreenDone && this.$style['root--splash-screen-displayed'],
            ]
        },
        displayOnce(): boolean {
            return toBoolean(AppConst.DISPLAY_SPLASH_SCREEN_ONCE)
        },
        isSplashScreenEnabled(): boolean {
            const isDisplayedOnlyOnFirstTime = !this.displayOnce || (this.displayOnce && !this.isAlreadyRegister)
            return toBoolean(AppConst.DISPLAY_SPLASH_SCREEN) && isDisplayedOnlyOnFirstTime
        },
        isSplashScreenDone(): boolean {
            return this.$store.state.splashScreenDone
        },
    },
    watch: {
        isSplashScreenDone(isDone: boolean) {
            if (this.isSplashScreenEnabled && isDone && this.displayOnce) sessionStorage.setItem(STORAGE_KEY, 'true')
        },
        isSplashScreenEnabled() {
            this.setSplashScreenDone()
        },
    },
    mounted() {
        this.isSplashScreenRegister()
        this.isReady()
    },
    methods: {
        isSplashScreenRegister() {
            this.isAlreadyRegister = toBoolean(sessionStorage.getItem(STORAGE_KEY))
        },
        isReady() {
            if (
                (this.displayOnce && this.isAlreadyRegister) ||
                (this.isSplashScreenEnabled && this.isSplashScreenDone)
            ) {
                this.setSplashScreenDone()
            }
        },
        setSplashScreenDone() {
            this.$store.commit(MutationType.SPLASH_SCREEN_DONE, true)
        },
    },
})
