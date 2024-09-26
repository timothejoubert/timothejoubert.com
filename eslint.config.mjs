import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt(
    {
        ignores: ['dist', '.output'],
    },
).override('nuxt/vue/rules', {
    rules: { 'vue/require-default-prop': 'off' },
})
