<script lang="ts" setup>
const themeInputs = Object.keys(getThemes()).map((theme) => {
	return {
		name: 'color-theme',
		id: 'theme-' + theme,
		value: theme,
	}
})

const currentTheme = useCookie('user-color-theme', {
	default: () => themeInputs[0]?.value || 'main',
	watch: true,
})

const theme = computed(() => getTheme(currentTheme.value) || {})
const metaScript = computed(() => [{ name: 'theme-color', content: theme.value?.['color-background'] }])

if (import.meta.server) {
	const content
		= Object.entries(theme.value).reduce((acc, [key, value]) => {
			acc += '--' + key + ': ' + value + '; '

			return acc
		}, '')
	console.log(content)

	useHead({
		style: [{ innerHTML: ':root{ ' + content + ' }' }],
	})
}

useHead({
	meta: metaScript,
})

function onChange(e: Event) {
	const value = (e.target as { value?: string | undefined })?.value

	if (value) currentTheme.value = value
}

function setCssVars() {
	const root = window?.document?.documentElement
	if (!theme.value || !root) return

	for (const key in theme.value) {
		root.style.setProperty('--' + key, theme.value[key] || '')
	}
}

watch(theme, setCssVars)
</script>

<template>
    <fieldset>
        <legend>Select a color theme</legend>

        <div
            v-for="theme in themeInputs"
            :key="theme.id"
        >
            <input
                :id="theme.id"
                type="radio"
                :name="theme.name"
                :value="theme.value"
                :checked="currentTheme === theme.value"
                @change="onChange"
            >
            <label :for="theme.id">{{ theme.value }}</label>
        </div>
    </fieldset>
</template>

<style lang="scss" module>
</style>
