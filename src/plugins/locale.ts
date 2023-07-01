import { Context } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

export default function (context: Context, inject: Inject) {
    inject('getLocalePath', (): '/en' | '' => {
        return context.i18n.locales.length > 1 && context.i18n.locale === 'en' ? '/en' : ''
    })
}
