<script lang="ts" setup>
const linkList = computed(() => {
    return [
        { link: '/', label: 'Projets' },
        { link: '/archive', label: 'Archive' },
        { link: '/a-propos', label: 'À propos' },
    ]
})
</script>

<template>
    <nav
        v-if="linkList.length"
        :class="$style.root"
        aria-label="Main"
    >
        <ul :class="$style.list">
            <li
                v-for="(item, i) in linkList"
                :key="i"
                :class="$style.item"
            >
                <VLink
                    :to="item.link"
                    :class="$style.link"
                >
                    {{ item.label }}
                </VLink>
            </li>
        </ul>
    </nav>
</template>

<style lang="scss" module>
.root {
    position: fixed;
    bottom: rem(40);
    left: 50%;
    border-radius: rem(6);
    background-color: black;
    translate: -50% 0;
}

.list {
    display: flex;
    padding: initial;
    margin: initial;
    gap: rem(4);
}

.item {
    list-style: none;
}

.link {
    display: flex;
    height: rem(38);
    align-items: center;
    justify-content: center;
    border-radius: rem(3);
    color: white;
    padding-inline: rem(14);
    text-decoration: none;
}
</style>
