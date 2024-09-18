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
    translate: -50% 0;
    background-color: black;
    border-radius: rem(6);
}

.list {
    display: flex;
    gap: rem(4);
    padding: initial;
    margin: initial;
}

.item {
    list-style: none;
}

.link {
    display: flex;
    align-items: center;
    justify-content: center;
    height: rem(38);
    padding-inline: rem(14);
    text-decoration: none;
    color: white;
    border-radius: rem(3);
}
</style>
