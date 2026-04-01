<script lang="ts" setup>
const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value
const id = 'setting-modal-' + useId()
</script>

<template>
	<div :class="$style.root">
		<slot name="target">
			<button
				:class="$style.button"
				:aria-controls="id"
				:aria-expanded="expanded"
				@click="toggle"
			>
				<VIcon
					name="setting"
					size="1.3em"
				/>
			</button>
		</slot>
		<div
			:class="[$style.content, expanded && $style['content--visible']]"
			:aria-label="$t('show_setting.aria_label')"
			:key="id"
		>
			<div :class="$style.inner">
				<VThemeSwitcher />
				<div :class="$style['setting-item']">
					<label for="grid_value">Grid value</label>
					<input id="grid_value" type="number" min="1" value="4" max="5" />
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" module>
.root {
	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}

.button {
	position: relative;
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
	border: none;
	border-radius: 9px;
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

.content {
	position: absolute;
	z-index: -1;
	top: 0;
	width: fit-content;
	min-width: 280px;
	max-width: 100%;
	border-radius: 9px;
	background-color: var(--color-surface);
	color: var(--color-content);
	opacity: 0;
	pointer-events: none;
	transition: opacity .22s ease(out-quad), translate .22s ease(out-quad);
	translate: 0 -80%;

	@supports (corner-shape: squircle) {
		border-radius: 24px;
        corner-shape: squircle;
    }

	&--visible {
		opacity: 1;
		pointer-events: initial;
		translate: 0 calc(-100% - 12px);
	}
}

.inner {
	padding: 20px;
}

.setting-item {
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
}
</style>
