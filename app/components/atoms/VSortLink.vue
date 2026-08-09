<script lang="ts">
export interface SortState {
	field: string
	direction: 'asc' | 'desc'
}
</script>

<script lang="ts" setup>
const props = defineProps<{
	label: string
	field: string
}>()

const model = defineModel<SortState>({ required: true })

const isActive = computed(() => model.value.field === props.field)

const nextDirection = computed(() => {
	return isActive.value && model.value.direction === 'asc' ? 'desc' : 'asc'
})
const sortState = computed(() => {
	if (!isActive.value) return 'none'
	return model.value.direction === 'asc' ? 'ascending' : 'descending'
})

function onClick() {
	model.value = { field: props.field, direction: nextDirection.value }
}
</script>

<template>
    <button
        type="button"
        :class="$style.link"
        @click="onClick"
    >
        {{ props.label }}
        <VIcon
            :name="nextDirection === 'asc' ? 'material-symbols:arrow-downward-alt' : 'material-symbols:arrow-upward-alt'"
        />
        <span
            v-if="sortState !== 'none'"
            class="visually-hidden"
        >
            {{ sortState === 'ascending' ? $t('sort_ascending') : $t('sort_descending') }}
        </span>
    </button>
</template>

<style lang="scss" module>
.link {
	display: inline-flex;
	align-items: center;
	padding: 0;
	border: none;
	background: none;
	color: inherit;
	cursor: pointer;
	font: inherit;
	gap: 4px;
	text-decoration: none;
}
</style>
