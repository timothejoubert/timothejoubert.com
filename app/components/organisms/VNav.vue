<script lang="ts" setup>
import { prismicDocumentType } from '~~/shared/prismic-document'

const { data } = await usePrismicFetchDocument(prismicDocumentType.MENU)

const prismic = usePrismic()
const links = computed(() => {
	return data.value.data.links.filter((link) => {
		return prismic.isFilled.link(link)
	}).map((link) => {
		return {
			...prismic.asLinkAttrs(link),
			label: link.text,
		}
	})
})
</script>

<template>
    <nav
        :aria-label="$t('main_nav.aria_label')"
        :class="$style.root"
    >
        <ul :class="$style.list">
            <li
                v-for="link in links"
                :key="link.href"
                :class="$style.item"
            >
                <slot
                    :url="link.href"
                    :label="link.label"
                >
                    <VPrismicLink
                        :to="link.href"
                        :class="$style.link"
                        :target="link.target"
                        :rel="link.rel"
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

    &:not(:has(li:hover)) li:has(a[aria-current="page"]) {
        anchor-name: --hovered-link;
    }

    li:hover {
        anchor-name: --hovered-link;
    }

    &::after {
        content: "";
        position: absolute;
        top: calc(anchor(bottom) - 6px);
        left: calc(anchor(left) + 14px);
        right: calc(anchor(right) + 14px);
        bottom: calc(anchor(bottom) + 3px);
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
