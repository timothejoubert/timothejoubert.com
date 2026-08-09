<script lang="ts" setup>
import type { ProjectDocument } from '~~/prismicio-types'

const props = defineProps<{
    document: ProjectDocument
    backPath: string
}>()

const project = computed(() => props.document.data)
const prismic = usePrismic()

const videoExtensions = ['mp4', 'mov']

function endWidthVideoExt(url: string) {
    const afterLastDot = url.substring(url?.lastIndexOf('.'))
    return videoExtensions.some(ext => afterLastDot.startsWith('.' + ext))
}

const medias = computed(() => {
    return project.value.medias
        .filter(m => prismic.isFilled.linkToMedia(m.media) && m.media.url)
        .map(mediaGroup => ({
            ...mediaGroup,
            type: endWidthVideoExt(mediaGroup.media.url) ? 'video' : 'other',
        }))
})

const tags = computed(() => {
    if (project.value.tag_group?.length) return project.value.tag_group.filter(item => item.tag).map(item => item.tag)
    return props.document.tags || []
})

const { prevProject, nextProject } = useProjectNeighbors(props.document)
</script>

<template>
    <VWindow
        :class="$style.root"
        container-selector="body"
    >
        <template #head>
            <h1 :class="$style.title">
                {{ document.data.title }}
            </h1>
            <NuxtLink
                :to="backPath"
                :class="$style.back"
                :title="$t('back_to_projects.aria_label')"
            >
                <VIcon prefix="material-symbols" name="cancel" />
            </NuxtLink>
        </template>

        <div :class="$style.content">
            <div :class="$style.attributes">
                <ul v-if="tags.length" :class="$style.tags">
                    <LazyVTag
                        v-for="(tag, i) in tags"
                        :key="tag || i"
                        :label="tag"
                        wrapper="li"
                    />
                </ul>
                <VTime
                    :date="project.date"
                    format="short"
                />
            </div>
            <LazyVText
                v-if="project.short_description"
                :content="project.short_description"
                :class="$style['short-description']"
            />
            <LazyVText
                v-if="project.content"
                :content="project.content"
                :class="$style.description"
            />
        </div>

        <VPrismicImg :field="project.thumbnail" />

        <div v-if="medias.length" :class="$style.medias">
            <div
                v-for="(mediaGroup, i) in medias"
                :key="`media-${i}`"
                :class="$style.media"
            >
                <VVideoPlayer
                    v-if="mediaGroup.type === 'video' && mediaGroup.media?.url"
                    autoplay
                    muted
                    :controls="false"
                    loop
                    :src="mediaGroup.media.url"
                />
                <VPrismicImg v-else :field="mediaGroup.media" />
            </div>
        </div>

        <div
            v-if="prevProject || nextProject"
            :class="$style.footer"
        >
            <NuxtLink
                v-if="prevProject"
                :to="prevProject.path"
                :class="$style['footer-link']"
            >
                <VIcon prefix="material-symbols" name="arrow-back" />
                {{ prevProject.title }}
            </NuxtLink>
            <NuxtLink
                v-if="nextProject"
                :to="nextProject.path"
                :class="[$style['footer-link'], $style['footer-link--next']]"
            >
                {{ nextProject.title }}
                <VIcon prefix="material-symbols" name="arrow-forward" />
            </NuxtLink>
        </div>
    </VWindow>
</template>

<style lang="scss" module>
.root {
    --v-project-page-padding-inline: 16px;

    z-index: 11;
    top: var(--app-padding-top);
    right: var(--app-padding-right);
    overflow: hidden auto;
    width: 50%;
    max-width: var(--app-inner-max-width);
    max-height: var(--app-inner-max-height);
	overscroll-behavior: contain;
}

.title {
    font-size: 18px;
    margin-block: initial;
    padding-block: 12px;
    padding-inline: var(--v-project-page-padding-inline);
}

.back {
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    font-size: 22px;
    padding-inline: var(--v-project-page-padding-inline);
}

.content {
    padding: var(--v-project-page-padding-inline);
    background-color: var(--color-background);
}

.attributes {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    padding-block: 8px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    gap: inherit;
    list-style: none;
}

.short-description {
    margin-top: 16px;
}

.description {
    margin-top: 16px;
}

.media {
    margin-block: 0;
}

.footer {
    display: flex;
    justify-content: space-between;
    padding: var(--v-project-page-padding-inline);
    background-color: var(--color-background);
    gap: 10px;
}

.footer-link {
    display: flex;
    align-items: center;
    color: inherit;
    gap: 6px;
    text-decoration: none;

    &--next {
        margin-left: auto;
        text-align: right;
    }
}
</style>
