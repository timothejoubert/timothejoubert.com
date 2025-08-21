<script lang="ts" setup>
defineProps<{
	expanded: boolean
}>()
</script>

<template>
    <div
        v-show="expanded"
        :class="[$style.content, expanded && $style['content--visible']]"
    >
        <div :class="$style.inner">
            <VThemeSwitcher />
        </div>
    </div>
</template>

<style lang="scss" module>
.content {
	position: absolute;

	position-anchor: --button-setting-anchor;
    position-area: top;

	position-try-fallbacks: flip-inline;
	position-try: flip-inline;

	// bottom: calc(anchor(--button-setting-anchor top) + 16px);
	// left: anchor(--button-setting-anchor left);

	background-color: var(--color-surface);
	color: var(--color-content);
	border-radius: 9px;
	bottom: 16px;
	width: 100%;
	overflow: hidden;
	height: 0px;
	// opacity: 0;
	transition: all .3s;
	transition-behavior: allow-discrete;

	&--visible {
		opacity: 1;
		height: 200px;

		@starting-style {
			opacity: 0;
			height: 0px;
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
