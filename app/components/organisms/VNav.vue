<script lang="ts" setup>
const links = [
	{ label: 'Home', url: '/' },
	{ label: 'Archive', url: '/archive' },
	{ label: 'About', url: '/a-propos' },
	{ label: 'Other', url: '/other' },
]
</script>

<template>
    <nav
        :aria-label="$t('main_nav')"
        :class="$style.root"
    >
        <ul :class="$style.list">
            <li
                v-for="link in links"
                :key="link.url"
                :class="$style.item"
            >
                <slot
                    :url="link.url"
                    :label="link.label"
                >
                    <VPrismicLink
                        :to="link.url"
                        :class="$style.link"
                    >
                        {{ link.label }}
                    </VPrismicLink>
                </slot>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" module>
.list {
    margin-block: initial;
    display: flex;
    background-color: var(--color-surface);
    padding: 5px;
    border-radius: 9px;
    width: fit-content;
    isolation: isolate;

    anchor-name: --hovered-link;

    @supports (corner-shape: squircle) {
        border-radius: 32px;
        corner-shape: squircle;
    }

    li:hover {
        anchor-name: --hovered-link;
    }

    li:has(a[aria-current="page"]) {
        anchor-name: --hovered-link;
    }

    &:has(a[aria-current="page"]) {
        anchor-name: --hovered-link;
    }

    &::after {
        content: "";
        position: absolute;
        top: calc(anchor(bottom) - 3px);
        left: calc(anchor(left) + 8px);
        right: calc(anchor(right) + 8px);
        bottom: calc(anchor(bottom));
        border-radius: 10px;
        z-index: -1;
        background: var(--color-background);

        position-anchor: --hovered-link;

        transition: 0.3s ease(in-out-quad);

        @supports (corner-shape: squircle) {
            border-radius: 24px;
            corner-shape: squircle;
        }
    }

    &:has(a:hover)::after {
        top: anchor(top);
        left: anchor(left);
        right: anchor(right);
        bottom: anchor(bottom);

        transition: 0.25s ease(out-quart);
    }
}

.item {
    list-style: none;
}

.link {
    display: block;
    padding: 6px 16px 8px 16px;
    color: var(--color-content);
    text-decoration: none;
}
</style>
