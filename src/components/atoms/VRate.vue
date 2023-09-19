<template>
    <div :class="$style.root">
        <component
            :is="i === starNumber ? 'div' : 'icon-star'"
            v-for="i in starNumber"
            :key="i"
            :class="[$style.star, i === starNumber && $style['star-wrapper']]"
            :style="i === starNumber && { '--star-rest': rest }"
        >
            <icon-star :class="[$style.star, $style['star-bg']]" />
            <icon-star :class="[$style.star, $style['star-fragment']]" />
        </component>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import IconStar from '~/assets/images/icons/star.svg?sprite'
const RATE_MAX = 20
const DISPLAYED_MAX = 4

export default Vue.extend({
    name: 'VRate',
    components: { IconStar },
    props: {
        rate: Number,
    },
    computed: {
        result(): number {
            return this.rate / (RATE_MAX / DISPLAYED_MAX)
        },
        starNumber(): number {
            return Math.ceil(this.result)
        },
        rest(): string {
            return (this.starNumber - this.result).toFixed(3)
        },
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    align-items: center;
    gap: rem(4);
}

.wrapper {
    position: relative;
}

.star {
    width: rem(16);
    height: auto;

    &-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &-fragment {
        position: absolute;
        clip-path: inset(0 calc(var(--star-rest) * 100%) 0 0);
    }

    &-bg {
        opacity: 0.1;
    }
}
</style>
