import svgLoader from 'vite-svg-loader'
import { PREVIEW_PATH } from './app/constants/prismic-preview'
import { I18N_DEFAULT_LOCALE, I18N_LOCALES } from './i18n/i18n'
import { version } from './package.json'
import { prismicDocumentRoutes } from './shared/prismic-routes'
import { repositoryName } from './slicemachine.config.json'

// const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NUXT_PUBLIC_SITE_ENV === 'production'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image', '@nuxtjs/i18n', '@nuxtjs/prismic', '@vueuse/nuxt'],
	plugins: [
		'~/plugins/anchor-polyfill.client.ts',
	],

	components: ['~/components/atoms', '~/components/molecules', '~/components/organisms'],
	devtools: { enabled: true },

	css: ['~~/app/assets/scss/main.scss'],
	runtimeConfig: {
		public: {
			version,
			site: {
				name: '',
				url: '',
				env: '',
			},
		},
	},

	experimental: {
		asyncContext: true,
	},

	compatibilityDate: '2025-07-15',
	vite: {
		build: {
			// If the generated svg-sprite file is under 4kb, the build process converts it to an inlined base64 file,
			// which breaks the use of icons.
			assetsInlineLimit: 0,
		},
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "assets/scss/_resources.scss" as *;',
					quietDeps: true,
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

	postcss: {
		plugins: {
			// https://github.com/cuth/postcss-pxtorem?tab=readme-ov-file#options
			'postcss-pxtorem': {
				propList: ['*'],
				exclude: /(node_modules|scss\/export)/i,
			},
		},
	},

	eslint: {
		config: {
			stylistic: {
				indent: 4,
			},
		},
	},
	// https://i18n.nuxtjs.org/docs/getting-started/usage
	i18n: {
		strategy: 'prefix_except_default',
		detectBrowserLanguage: {
			useCookie: true,
		},
		defaultLocale: I18N_DEFAULT_LOCALE,
		locales: I18N_LOCALES.map(locale => ({
			code: locale,
			file: `nuxt.${locale}.json`,
		})),
		compilation: {
			strictMessage: false, // Message can contains HTML tag
		},
	},
	// https://nuxt.com/modules/icon#usage
	icon: {
		componentName: 'NuxtIcon',
		class: '',
		fallbackToApi: false,
		localApiEndpoint: '/_nuxt_icon',
		customCollections: [
			{
				normalizeIconName: false,
				prefix: 'icon',
				dir: './app/assets/images/icons',
			},
		],
	},

	// https://image.nuxt.com/get-started/configuration
	image: {
		imgix: {
			baseURL: '',
		},
		quality: 75,
		screens: {
			xs: 375, // override nuxt/img sizes to match our breakpoints
			sm: 480, // override
			vl: 1280, // override
			xl: 1440, // override
			xxl: 1600, // override
			hd: 1920, // additional size
			qhd: 2500, // additional size
		},
		// @ts-expect-error not working with [1]
		densities: '1',
		presets: {
			default: {
				sizes: 'xs:100vw md:100vw lg:100vw vl:100vw xl:100vw hd:100vw qhd:100vw',
			},
		},
	},
	prismic: {
		endpoint: repositoryName,
		preview: PREVIEW_PATH,
		toolbar: !isProd,
		clientConfig: {
			routes: prismicDocumentRoutes,
		},
	},
})
