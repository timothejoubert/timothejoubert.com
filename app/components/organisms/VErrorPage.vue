<script lang="ts" setup>
defineProps<{
	title: string
	subtitle: string
	content: string
	errorMessage?: string
}>()
</script>

<template>
    <main
        id="main-content"
        :class="$style.root"
    >
        <div
            role="alert"
            :class="$style.card"
        >
            <p :class="$style.subtitle">
                {{ subtitle }}
            </p>
            <h1 :class="$style.title">
                {{ title }}
            </h1>
            <p :class="$style.content">
                {{ content }}
            </p>
            <pre
                v-if="errorMessage"
                :class="$style.debug"
            >{{ errorMessage }}</pre>
            <div :class="$style.actions">
                <slot />
            </div>
        </div>
    </main>
</template>

<style lang="scss" module>
.root {
    display: flex;
    min-height: var(--app-inner-max-height, 100svh);
    align-items: center;
    justify-content: center;
    text-align: center;
}

.card {
    max-width: 46ch;
}

.subtitle {
    color: var(--theme-color-primary);
    font-size: 14px;
    letter-spacing: 0.04em;
    margin-block: 0 8px;
    text-transform: uppercase;
}

.title {
    font-size: 32px;
    margin-block: 0 16px;
}

.content {
    margin-block: 0 32px;
}

.debug {
    padding: 12px 16px;
    border-radius: 9px;
    background-color: var(--color-surface);
    font-size: 13px;
    margin-block: 0 32px;
    overflow-wrap: anywhere;
    overflow-x: auto;
    text-align: left;
    white-space: pre-wrap;
}

.actions {
    display: flex;
    justify-content: center;
    gap: 12px;
}
</style>
