<script lang="ts" setup>
const props = defineProps<{
	label: string
	field: string
}>()

const ORDERING_PREFIX = 'ordering'

const route = useRoute()
const sort = computed(() => {
	return route.query[ORDERING_PREFIX] === 'asc' ? 'desc' : 'asc'
})

const href = computed(() => route.path + `?field=${props.field}&${ORDERING_PREFIX}=${sort.value}`)
</script>

<template>
    <a
        :href="href"
        :class="$style.link"
    >
        {{ props.label }}
        <VIcon
            prefix="material-symbols"
            :name="sort === 'asc' ? 'arrow-downward-alt' : 'arrow-upward-alt'"
        />
    </a>
</template>

<style lang="scss" module>
.link {
	display: inline-flex;
	align-items: center;
	color: inherit;
	gap: 4px;
	text-decoration: none;
}
</style>
