<script lang="ts" setup>
const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value
const id = 'setting-modal'
</script>

<template>
    <div :class="$style.root">
        <VNav />
        <button
            :class="$style.button"
            :aria-controls="id"
            :aria-expanded="expanded"
            @click="toggle"
        >
            <VIcon
                name="uil:setting"
                size="1.3em"
            />
        </button>
        <VSettingModal
            :id="id"
            :expanded="expanded"
        />
    </div>
</template>

<style lang="scss" module>
.root {
	display: flex;
	gap: 20px;
}

.button {
	position: relative;
	border: none;
	border-radius: 9px;
	anchor-name: --button-setting-anchor;
	background-color: var(--color-surface);
	color: var(--color-content);
	cursor: pointer;
	padding-inline: 16px;

	&::before {
		position: absolute;
		background-color: var(--color-background);
		content: '';
		inset: 5px;
		scale: 0 1;
		transform-origin: left;
		transition: scale 0.25s ease(out-quart);

		@supports (corner-shape: squircle) {
			border-radius: 42px;
			corner-shape: squircle;
		}
	}

	&:hover::before {
		scale: 1;
	}

	&[aria-expanded="true"]::before {
		scale: 1;
	}

	@supports (corner-shape: squircle) {
        border-radius: 24px;
        corner-shape: squircle;
    }
}
</style>
