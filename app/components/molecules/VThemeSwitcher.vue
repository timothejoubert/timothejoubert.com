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
        <legend>{{ $t('theme_switcher.legend') }}</legend>
        <div
            v-for="themeInput in themeInputs"
            :key="themeInput.id"
        >
            <input
                :id="themeInput.id"
                type="radio"
                :name="themeInput.name"
                :value="themeInput.value"
                :checked="themeInput.value === currentTheme"
                @change="onChange"
            >
            <label :for="themeInput.id">{{ themeInput.value }}</label>
        </div>
    </fieldset>
</template>
