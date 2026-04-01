<script  lang="ts" setup="">
import type { DateField } from '@prismicio/client'
import { parseDate } from '~/utils/prismic/prismic-date'

const props = withDefaults(defineProps<{
	date: string | undefined | DateField
	format?: 'year' | 'month' | 'day' | 'full'
}>(), {
	format: 'year',
})

const output = computed(() => {
	const date = parseDate(props.date)

	if (props.format === 'year') return date?.year
	else if (props.format === 'month') return date?.month
	else if (props.format === 'day') return date?.day

	return props.date
})
</script>

<template>
    <time
        v-if="date"
        :datetime="date"
    >{{ output }}</time>
</template>
