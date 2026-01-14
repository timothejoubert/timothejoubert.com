<script lang="ts" setup>
const expanded = ref(false)
const toggle = () => expanded.value = !expanded.value
const id = 'setting-modal-' + useId()
</script>

<template>
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
        v-show="expanded"
        :class="[$style.content, expanded && $style['content--visible']]"
        :aria-label="$t('show_setting.aria_label')"
    >
        <div :class="$style.inner">
            <VThemeSwitcher />
        </div>
    </div>
</template>

<style lang="scss" module>
.button {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
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

.content {
	position: absolute;
	bottom: 16px;
	overflow: hidden;
	width: 100%;
	height: 0;
	border-radius: 9px;

	// bottom: calc(anchor(--button-setting-anchor top) + 16px);
	// left: anchor(--button-setting-anchor left);

	background-color: var(--color-surface);
	color: var(--color-content);
	position-anchor: --button-setting-anchor;
    position-area: top;
	position-try: flip-inline;
	position-try-fallbacks: flip-inline;

	// opacity: 0;
	transition: all .3s;
	transition-behavior: allow-discrete;

	&--visible {
		height: 200px;
		opacity: 1;

		@starting-style {
			height: 0;
			opacity: 0;
		}
	}

	@supports (corner-shape: squircle) {
        border-radius: 24px;
        corner-shape: squircle;
    }
}

.inner {
	padding: 20px;
}
</style>
