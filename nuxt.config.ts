import svgLoader from 'vite-svg-loader'
import { endpoint } from './slicemachine.config.json'
import { version } from './package.json'
import { hoistUseStatements } from './utils/vite/hoist-use-statements'
import { I18N_DEFAULT_LOCALE, I18N_LOCALES } from './i18n.config'
import { prismicDocumentRouteList } from './utils/prismic/route-resolver'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtConfig({
    devtools: { enabled: true },
    experimental: {
        asyncContext: true,
    },
    alias: {
        '#root': __dirname,
    },
    app: {
        head: {
            htmlAttrs: {
                lang: I18N_DEFAULT_LOCALE,
            },
            meta: [
                { hid: 'version', name: 'version', content: version || '' },
            ],
            link: [
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
                { rel: 'manifest', href: '/favicon/site.webmanifest' },
                { rel: 'mask-icon', href: '/favicon/safari-pinned-tab.svg', color: '#fff' },
            ],
        },
    },

    router: {
        options: {
            scrollBehaviorType: 'smooth',
        },
    },
    plugins: [],
    components: [
        '~/components/atoms',
        '~/components/molecules',
        '~/components/organisms',
        '~/components/pages',
    ],

    runtimeConfig: {
        public: {
            version,
            site: {
                name: '',
                url: 'http://localhost:3000',
                environment: 'development',
            },
        },
    },

    css: ['~/assets/scss/main.scss'],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: hoistUseStatements(`@import "~/assets/scss/_style-resources.scss";`),
                    quietDeps: true,
                    // For now, just silence the deprecation warning.
                    // But we have to use Dart Sass modern API https://sass-lang.com/documentation/breaking-changes/legacy-js-api/ soon.
                    // Vite 5.x uses the legacy API as default https://vitejs.dev/config/shared-options.html#css-preprocessoroptions
                    // Probably for best performance we should use `api: "modern-compiler"` and `sass-embedded` package.
                    // Waiting on Vite fixing the missing sourcemap files https://github.com/vitejs/vite/pull/18113 warning.
                    silenceDeprecations: ['legacy-js-api'],
                },
            },
        },
        plugins: [
            // https://github.com/jpkleemans/vite-svg-loader?tab=readme-ov-file#setup
            svgLoader({
                svgoConfig: {
                    multipass: true,
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeTitle: false,
                                    // viewBox is required to resize SVGs with CSS.
                                    // @see https://github.com/svg/svgo/issues/1128
                                    removeViewBox: false,
                                },
                            },
                        },
                    ],
                },
                defaultImport: 'url',
            }),
        ],
    },
    nitro: {
        routeRules: {
            '/**': {
                headers: {
                    // https://web.dev/articles/floc?hl=fr#can_websites_opt_out_of_being_included_in_the_floc_computation
                    'Permissions-Policy': 'interest-cohort=()',
                    // Hardening client security policies
                    // https://developer.mozilla.org/fr/docs/Web/HTTP/CSP
                    'Content-Security-Policy': [
                        // Only allows these iframe origins
                        'frame-src \'self\' *.youtube-nocookie.com *.youtube.com *.vimeo.com *.instagram.com *.soundcloud.com *.google.com *.deezer.com *.spotify.com',
                        // Only allows these script origins
                        'script-src \'self\' \'unsafe-inline\' *.googletagmanager.com *.youtube.com *.google.com *.googleapis.com *.gstatic.com',
                        // Only allows these images origins
                        // "img-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com",
                    ].join('; '),
                },
            },
            '/_icons': {
                headers: {
                    'X-Robots-Tag': 'noindex', // Do not index the page and remove it from sitemap
                },
            },
            '/_stories/**': {
                headers: {
                    'X-Robots-Tag': 'noindex',
                },
            },
        },
    },

    ignore: [
        isDev ? undefined : 'pages/_stories/**',
        'assets/backup/**',
    ],

    modules: [
        '@nuxt/image',
        '@nuxtjs/prismic',
        '@nuxtjs/svg-sprite',
        '@nuxt/image',
        '@nuxtjs/i18n',
        '@nuxtjs/sitemap',
        '@vueuse/nuxt',
        '@nuxt/eslint',
    ],

    prismic: {
        endpoint,
        preview: '/preview',
        toolbar: false,
        clientConfig: {
            routes: prismicDocumentRouteList,
        },
    },

    // https://github.com/nuxt-modules/svg-sprite#options
    svgSprite: {
        input: '~/assets/images/icons',
        output: '~/assets/images/sprites',
    },

    // https://v8.i18n.nuxtjs.org/getting-started/setup
    i18n: {
        strategy: 'prefix_except_default',
        // I18n issue, disabled detectBrowserLanguage work only with empty obj
        // https://github.com/nuxt-modules/i18n/issues/3039
        detectBrowserLanguage: {},
        defaultLocale: I18N_DEFAULT_LOCALE,
        locales: I18N_LOCALES.map(locale => ({
            code: locale,
            file: `nuxt.${locale}.json`,
        })),
        lazy: true,
        langDir: 'assets/locales/',
        compilation: {
            strictMessage: false, // Allow value to include HTML
        },
    },

    // https://image.nuxt.com/get-started/configuration
    image: {
        imgix: {
            baseURL: '',
        },
        quality: 75,
        // https://image.nuxt.com/get-started/configuration#screens
        screens: {
            xs: 375,
            sm: 480,
            vl: 1280, // initially xl
            xl: 1440,
            xxl: 1600,
            hd: 1920,
            qhd: 2500,
        },
        // @ts-expect-error not working with [1]
        densities: '1',
        presets: {
            default: {
                sizes: 'xs:100vw sm:100vw md:100vw lg:100vw vl:100vw xl:100vw xxl:100vw hd:100vw qhd:100vw',
            },
        },
    },

    // https://www.nuxtseo.com/sitemap/getting-started/installation
    // sitemap: {
    //     enabled: !isGenerateMaintenance,
    //     sources: ['/api/sitemap'],
    // },
    // https://eslint.nuxt.com/packages/module
    eslint: {
        config: {
            stylistic: {
                indent: 4,
            },
        },
    },

    compatibilityDate: '2024-07-09',
})
