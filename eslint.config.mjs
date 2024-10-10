import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        ignores: ['dist', '.output'],
    },
).override('nuxt/vue/rules', {
    rules: { 'vue/require-default-prop': 'off' },
})
