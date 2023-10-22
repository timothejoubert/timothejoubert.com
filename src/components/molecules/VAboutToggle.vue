<template>
    <div :class="[$style.root, isAboutOpen && $style['root--open']]">
        <button :class="$style.button" :aria-label="ariaLabel" @click="onClick">
            <span v-if="label">{{ label }}</span>
            <span :class="$style.icons">
                <span :class="$style['circle-outline']"></span>
                <span :class="$style['circle-filled']"></span>
                <icon-arrow :class="[$style.icon, $style['icon--arrow']]" />
                <icon-cross :class="[$style.icon, $style['icon--close']]" />
            </span>
        </button>
        <v-social-list-link :class="$style.socials" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconArrow from '~/assets/images/icons/arrow-top-small.svg?sprite'
import IconCross from '~/assets/images/icons/cross-small.svg?sprite'
import MutationType from '~/constants/mutation-type'

export default Vue.extend({
    name: 'VAboutToggle',
    components: { IconArrow, IconCross },
    computed: {
        label(): string {
            return this.$store.getters.settings?.data?.about_label
        },
        isAboutOpen(): boolean {
            return this.$store.state.isAboutOpen
        },
        ariaLabel(): string {
            const action = this.isAboutOpen ? 'Fermer' : 'Ouvrir'
            return `${action} la section ${this.label}`
        },
    },
    methods: {
        onClick() {
            const currentState = this.$store.state.isAboutOpen
            this.$store.commit(MutationType.ABOUT_OPENED, !currentState)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: sticky;
    z-index: 1;
    top: 0;
    display: flex;
    min-height: $v-about-toggle-height;
    align-items: center;
    justify-content: center;
}

.button {
    display: flex;
    align-items: center;
    gap: rem(18);

    &::after {
        position: absolute;
        z-index: -1;
        border-top: 1px solid var(--theme-foreground-color);
        background-color: var(--theme-background-color);
        content: '';
        inset: 0;
        pointer-events: none;
        transition: scale 0.5s ease(out-quad);
    }

    @media (hover: hover) {
        .root:not(.root--open) &:hover::after {
            scale: 1 1.1;
        }
    }
}

.icons {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.circle-outline {
    width: rem(5);
    height: rem(5);
    border: 1px solid var(--theme-foreground-color);
    border-radius: 100%;
}

.circle-filled {
    position: absolute;
    width: rem(18);
    height: rem(18);
    background-color: var(--theme-foreground-color);
    border-radius: 100%;
    clip-path: circle(0% at 50% 50%);
    transition: 0.4s ease(out-quart);
    transition-property: clip-path, scale;

    .root--open & {
        clip-path: circle(50% at 50% 50%);
    }

    .root--open .button & {
        scale: 0.9;
    }

    @media (hover: hover) {
        .button:hover & {
            clip-path: circle(50% at 50% 50%);
        }

        .root--open .button:hover & {
            scale: 1.1;
        }
    }
}

.icon {
    position: absolute;
    color: var(--theme-background-color);
    opacity: 0;
    transition: translate 0.3s 0.1s ease(out-quad);
    translate: 0 100%;

    @media (hover: hover) {
        .root:not(.root--open) .button:hover &--arrow {
            opacity: 1;
            translate: 0 0;
        }
        .root--open .button:hover &--close {
            animation: slide-out-in 0.4s ease(in-out-quad);
        }
    }

    .root--open &--close {
        opacity: 1;
        translate: 0 0;
    }
}

.socials {
    position: absolute;
    right: 0;
}

@keyframes slide-out-in {
    0% {
        translate: 0 0;
    }
    50% {
        opacity: 0;
        translate: 0 -100%;
    }
    50.01% {
        opacity: 0;
        translate: 0 100%;
    }
    100% {
        translate: 0 0;
    }
}
</style>
