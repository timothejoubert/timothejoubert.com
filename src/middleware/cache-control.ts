import { Context } from '@nuxt/types'

export interface HttpCacheControlParams {
    'max-age'?: number | false
    's-maxage'?: number | false
    'max-stale'?: number | false
    'min-fresh'?: number | false
    'no-cache'?: boolean
    'no-store'?: boolean
    'no-transform'?: boolean
    'only-if-cached'?: boolean
    'must-revalidate'?: boolean
    public?: boolean
    private?: boolean
    'proxy-revalidate'?: boolean
    immutable?: boolean
    'stale-if-error'?: number | false
    'stale-while-revalidate'?: number | false
}

const cacheControl =
    (options: HttpCacheControlParams | undefined = undefined) =>
    ({ res }: Context) => {
        if (!process.server) return

        const cacheOptions = {
            'max-age': 60,
            'stale-when-revalidate': 5,
            ...options,
        }

        const cacheControlValue = Object.entries(cacheOptions)
            .map(([key, value]) => `${key}=${value}`)
            .join(',')

        res.setHeader('Cache-Control', cacheControlValue)
    }

export default cacheControl
