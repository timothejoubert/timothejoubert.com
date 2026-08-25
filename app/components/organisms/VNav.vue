<script lang="ts" setup>
const { phase } = usePageIntro()

const showNavPlaceholder = computed(() => phase.value === 'nav' || phase.value === 'settings')
const settingsVisible = computed(() => phase.value !== 'idle' && phase.value !== 'nav')
const showSettingsPlaceholder = computed(() => phase.value === 'settings')
const realContentVisible = computed(() => phase.value === 'content' || phase.value === 'page' || phase.value === 'done')

// Generic entrance fade for the nav slot — plays on every load, independent of the intro
// sequence/session state.
const mounted = ref(false)
onMounted(async () => {
	await nextTick()
	mounted.value = true
})
</script>

<template>
    <div :class="$style.root">
        <div :class="[$style.slot, mounted && $style['slot--mounted']]">
            <VMainNav
                :class="[$style['real-content'], realContentVisible && $style['real-content--visible']]"
                :inert="!realContentVisible"
            />
            <div
                aria-hidden="true"
                :class="[$style['nav-placeholder'], showNavPlaceholder && $style['nav-placeholder--visible']]"
            >
                <VSplitText
                    render="chars"
                    :class="$style['placeholder-text']"
                    content="TIM"
                />
            </div>
        </div>

        <div :class="[$style.slot, settingsVisible && $style['slot--visible']]">
            <VSettingModal
                :class="[$style['real-content'], realContentVisible && $style['real-content--visible']]"
                :inert="!realContentVisible"
            />
            <div
                aria-hidden="true"
                :class="[$style['settings-placeholder'], showSettingsPlaceholder && $style['settings-placeholder--visible']]"
            >
                <VIcon
                    :class="$style.spinner"
                    name="material-symbols:progress-activity"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" module>
@keyframes weight-in {
    from {
        font-variation-settings: 'wght' 100;
    }

    to {
        font-variation-settings: 'wght' 700;
    }
}

@keyframes spin {
    from {
        rotate: 0deg;
    }

    to {
        rotate: 360deg;
    }
}

.root {
	position: fixed;
    z-index: 1001;
    bottom: calc(var(--app-padding-bottom) * 0.5);
	display: flex;
	gap: 20px;
    place-self: flex-end center;
    translate: 0 50%;

    &::before {
        position: absolute;
        display: block;
        backdrop-filter: blur(1px);
        content: '';
        inset: -60% -30%;
        mask-image: radial-gradient(closest-side, black 40%, transparent 100%);
        pointer-events: none;
    }
}

.slot {
    position: relative;
    display: grid;
    opacity: 0;
    translate: 0 8px;

    > * {
        z-index: 0;
        width: 100%;
        height: 100%;
        grid-area: 1 / 1;
    }

    &--mounted {
        opacity: 1;
        translate: 0 0;

        @media (prefers-reduced-motion: no-preference) {
            transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
        }
    }

    &--visible {
        opacity: 1;
        translate: 0 0;

        @media (prefers-reduced-motion: no-preference) {
            transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
        }
    }
}

.real-content {
    opacity: 0;

    @media (prefers-reduced-motion: no-preference) {
        transition: opacity 0.3s 0.2s ease(out-quad);
    }

    &--visible {
        opacity: 1;
    }
}

.nav-placeholder {
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 9px;
    background-color: var(--color-surface);
    opacity: 0;
    pointer-events: none;

    @media (prefers-reduced-motion: no-preference) {
        transition: opacity 0.5s ease(out-quad);
    }

    @supports (corner-shape: squircle) {
        border-radius: 32px;
        corner-shape: squircle;
    }

    &--visible {
        opacity: 1;
        pointer-events: initial;
    }
}

.placeholder-text {
	font-family: #{$fraktion-sans-family};
    font-size: 30px;
	font-variation-settings: 'wght' 700;
    line-height: 1;
    padding-inline: 4px;

	@media (prefers-reduced-motion: no-preference) {
		animation: weight-in 0.4s ease(out-quad) alternate infinite;
		animation-delay: calc(var(--data-char-index, 0) * 80ms);
	}
}

.settings-placeholder {
    z-index: 1;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    background-color: var(--color-surface);
    color: var(--color-content);
    opacity: 0;
    padding-inline: 16px;
    pointer-events: none;

    @media (prefers-reduced-motion: no-preference) {
        transition: opacity 0.3s ease(out-quad);
    }

    @supports (corner-shape: squircle) {
        border-radius: 24px;
        corner-shape: squircle;
    }

    &--visible {
        opacity: 1;
        pointer-events: initial;
    }
}

.spinner {
	@media (prefers-reduced-motion: no-preference) {
		animation: spin 0.8s linear infinite;
	}
}
</style>
