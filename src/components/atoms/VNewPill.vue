<template>
    <div v-if="displayed" :class="[$style.root, grow && $style['root--grow']]">
        <svg
            width="99"
            height="99"
            viewBox="0 0 99 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="$style.svg"
        >
            <path
                :class="$style.background"
                d="M47.0435 3.32056C48.265 1.66943 50.735 1.66943 51.9565 3.32056L57.7909 11.2074C58.6372 12.3514 60.1612 12.7598 61.4661 12.1922L70.4624 8.2792C72.3457 7.46002 74.4848 8.69501 74.7171 10.7357L75.8264 20.4831C75.9874 21.897 77.103 23.0126 78.5169 23.1736L88.2643 24.2829C90.305 24.5152 91.54 26.6543 90.7208 28.5376L86.8078 37.5339C86.2402 38.8388 86.6486 40.3628 87.7926 41.2091L95.6794 47.0435C97.3306 48.265 97.3306 50.735 95.6794 51.9565L87.7926 57.7909C86.6486 58.6372 86.2402 60.1612 86.8078 61.4661L90.7208 70.4624C91.54 72.3457 90.305 74.4848 88.2643 74.7171L78.5169 75.8264C77.103 75.9874 75.9874 77.103 75.8264 78.5169L74.7171 88.2643C74.4848 90.305 72.3457 91.54 70.4624 90.7208L61.4661 86.8078C60.1612 86.2402 58.6372 86.6486 57.7909 87.7926L51.9565 95.6794C50.735 97.3306 48.265 97.3306 47.0435 95.6794L41.2091 87.7926C40.3628 86.6486 38.8388 86.2402 37.5339 86.8078L28.5376 90.7208C26.6543 91.54 24.5152 90.305 24.2829 88.2643L23.1736 78.5169C23.0126 77.103 21.897 75.9874 20.4831 75.8264L10.7357 74.7171C8.69501 74.4848 7.46002 72.3457 8.2792 70.4624L12.1922 61.4661C12.7598 60.1612 12.3514 58.6372 11.2074 57.7909L3.32056 51.9565C1.66943 50.735 1.66943 48.265 3.32056 47.0435L11.2074 41.2091C12.3514 40.3628 12.7598 38.8388 12.1922 37.5339L8.2792 28.5376C7.46002 26.6543 8.69501 24.5152 10.7357 24.2829L20.4831 23.1736C21.897 23.0126 23.0126 21.897 23.1736 20.4831L24.2829 10.7357C24.5152 8.69501 26.6543 7.46002 28.5376 8.2792L37.5339 12.1922C38.8388 12.7598 40.3628 12.3514 41.2091 11.2074L47.0435 3.32056Z"
            />
            <path
                :class="$style.line"
                d="M51.4652 7.11314L56.9464 14.5225C57.7739 15.6411 59.264 16.0404 60.5399 15.4854L68.9915 11.8093C70.4982 11.154 72.2095 12.142 72.3953 13.7745L73.4375 22.9318C73.5949 24.3143 74.6857 25.4051 76.0682 25.5625L85.2255 26.6047C86.858 26.7905 87.846 28.5017 87.1907 30.0084L83.5146 38.4601C82.9596 39.736 83.3589 41.2261 84.4775 42.0536L91.8869 47.5348C93.2078 48.512 93.2078 50.488 91.8869 51.4652L84.4775 56.9464C83.3589 57.7739 82.9596 59.264 83.5146 60.5399L87.1907 68.9915C87.846 70.4982 86.858 72.2095 85.2255 72.3953L76.0682 73.4375C74.6857 73.5949 73.5949 74.6857 73.4375 76.0682L72.3953 85.2255C72.2095 86.858 70.4983 87.846 68.9916 87.1907L60.5399 83.5146C59.264 82.9596 57.7739 83.3589 56.9464 84.4775L51.4652 91.8869C50.488 93.2078 48.512 93.2078 47.5348 91.8869L42.0536 84.4775C41.2261 83.3589 39.736 82.9596 38.4601 83.5146L30.0085 87.1907C28.5018 87.846 26.7905 86.858 26.6047 85.2255L25.5625 76.0682C25.4051 74.6857 24.3143 73.5949 22.9318 73.4375L13.7745 72.3953C12.142 72.2095 11.154 70.4983 11.8093 68.9916L15.4854 60.5399C16.0404 59.264 15.6411 57.7739 14.5225 56.9464L7.11314 51.4652C5.79224 50.488 5.79224 48.512 7.11314 47.5348L14.5225 42.0536C15.6411 41.2261 16.0404 39.736 15.4854 38.4601L11.8093 30.0085C11.154 28.5018 12.142 26.7905 13.7745 26.6047L22.9318 25.5625C24.3143 25.4051 25.4051 24.3143 25.5625 22.9318L26.6047 13.7745C26.7905 12.142 28.5018 11.154 30.0084 11.8093L38.4601 15.4854C39.736 16.0404 41.2261 15.6411 42.0536 14.5225L47.5348 7.11314C48.512 5.79224 50.488 5.79224 51.4652 7.11314Z"
                stroke-width="1"
            />
        </svg>
        <span :class="$style.text"> {{ label }}</span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

export default Vue.extend({
    name: 'VNewPill',
    props: {
        label: { type: String, default: 'new' },
        grow: Boolean,
        date: [String, null] as PropType<string | null>,
    },
    computed: {
        displayed() {
            if (!this.date) return false

            const start = new Date()
            const end = new Date(this.date)

            const MS_PER_DAY = 1000 * 60 * 60 * 24 // milliseconds, minutes, seconds, hours
            const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
            const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())

            const dayDiff = Math.abs(Math.floor((startUtc - endUtc) / MS_PER_DAY))
            return dayDiff < 120
        },
    },
})
</script>

<style lang="scss" module>
.root {
    display: flex;
    width: var(--v-new-pill-width, rem(58));
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    transform: var(--v-new-pill-transform, translate(15px, -15px));
    transition: transform 0.3s ease(out-quad);

    &--grow {
        transform: translate(15px, -15px) scale(1.1);
    }
}

.background {
    fill: var(--theme-accent-color);
}

.svg {
    width: 100%;
    height: auto;
    animation: anim-star 30s infinite ease;
}

@keyframes anim-star {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.line {
    stroke: var(--theme-background-color);
}

.text {
    position: absolute;
    color: var(--theme-background-color);
    font-size: var(--v-new-pill-font-size, rem(17));
    font-variation-settings: 'wght' var(--v-new-pill-weight, 300), 'ital' 0;
    transition: 0.3s ease(out-quad);
    transition-property: transform, font-variation-settings;

    .root--grow & {
        font-variation-settings: 'wght' 600, 'ital' 10;
        transform: rotate(-10deg);
    }
}
</style>
