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
        <ul
            v-if="links?.length"
            :class="$style.list"
        >
            <li
                v-for="link in links"
                :key="link?.href"
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
    display: flex;
    width: fit-content;
    padding: 5px;
    border-radius: 9px;
    anchor-name: --hovered-link;
    background-color: var(--color-surface);
    isolation: isolate;
    margin-block: initial;

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
        position: absolute;
        z-index: -1;
        border-radius: 10px;
        background: var(--color-background);
        content: "";
        inset: calc(anchor(bottom) - 6px) calc(anchor(right) + 14px) calc(anchor(bottom) + 3px) calc(anchor(left) + 14px);
        position-anchor: --hovered-link;
        transition: 0.3s ease(in-out-quad);

        @supports (corner-shape: squircle) {
            border-radius: 24px;
            corner-shape: squircle;
        }
    }

    &:has(a:hover)::after {
        inset: anchor(top) anchor(right) anchor(bottom) anchor(left);
        transition: 0.25s ease(out-quart);
    }
}

.item {
    list-style: none;
}

.link {
    display: block;
    padding: 6px 16px 8px;
    color: var(--color-content);
    text-decoration: none;
}
</style>
