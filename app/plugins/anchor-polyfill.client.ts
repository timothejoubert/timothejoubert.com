export default defineNuxtPlugin(() => {
	if (!import.meta.client) return

	if ('anchorName' in document.documentElement.style) return

	import('@oddbird/css-anchor-positioning/fn').then(({ default: polyfill }) => {
		polyfill({
			elements: undefined,
			excludeInlineStyles: false,
			useAnimationFrame: false,
		})
	})
})
