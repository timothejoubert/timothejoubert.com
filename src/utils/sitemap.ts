import CustomType from '~/constants/custom-type'
import { CustomTypeName } from '~/types/prismic/app-prismic'
import { ProjectDocument } from '~~/prismicio-types'

// interface Route {
//     name?: string
//     path?: string
//     component?: string
//     chunkName?: string
//     url: string
// }

export function createSitemap(locale: string) {
    return {
        path: `/sitemap-${locale}.xml`,
        async routes() {
            if (!process.env.APP_URL) throw new Error('API URL or BASE URL is not configured.')
            const { $prismic } = require('@nuxtjs/prismic')

            const projectsResponse = await $prismic.api.query(
                $prismic.predicates.at('document.type', CustomType.PROJECT as CustomTypeName)
            )
            const routes = projectsResponse.results.map((page: ProjectDocument) => page.uid)

            return routes
        },
        // filter({ routes }: { routes: Route[] }) {
        //     return routes.filter((route) => {
        //         const routeLocale = route.name?.split(ROUTES_NAME_SEPARATOR)[1]
        //
        //         return !routeLocale || routeLocale === locale
        //     })
        // },
    }
}

export function createSitemaps(locales: string[]) {
    return locales.map((locale: string) => createSitemap(locale))
}
