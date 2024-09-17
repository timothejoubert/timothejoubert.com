import { withNuxt } from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        ignores: ['dist', '.output'],
    },
).override('nuxt/vue/rules', {
    // stories files can have any name
    files: ['**/*.stories.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
})
