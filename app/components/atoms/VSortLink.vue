<script lang="ts" setup>
const props = defineProps<{
	label: string
	field: string
}>()

const ORDERING_PREFIX = 'ordering'

const route = useRoute()
const router = useRouter()
const sort = computed(() => {
	return route.query[ORDERING_PREFIX] === 'asc' ? 'desc' : 'asc'
})

function onClick() {
	router.replace({ query: { field: props.field, [ORDERING_PREFIX]: sort.value } })
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
            :name="sort === 'asc' ? 'material-symbols:arrow-downward-alt' : 'material-symbols:arrow-upward-alt'"
        />
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
