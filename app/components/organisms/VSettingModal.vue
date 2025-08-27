<script lang="ts" setup>
defineProps<{
	expanded: boolean
}>()
</script>

<template>
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
