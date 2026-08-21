<script lang="ts" setup>
import { withQuery } from 'ufo'
import type { ProjectDocument } from '~~/prismicio-types'

const props = defineProps<{
    document?: ProjectDocument | null
    backPath: string
}>()

const route = useRoute()

// Keeps the current query (e.g. VArchivePage's sort) when navigating between projects,
// otherwise it gets dropped and the listing behind the modal resets/refetches.
function withCurrentQuery(path: string) {
    return withQuery(path, route.query)
}

const project = computed(() => props.document?.data)
const prismic = usePrismic()

const videoExtensions = ['mp4', 'mov']

function endWidthVideoExt(url: string) {
    const afterLastDot = url.substring(url?.lastIndexOf('.'))
    return videoExtensions.some(ext => afterLastDot.startsWith('.' + ext))
}

const medias = computed(() => {
    if (!project.value) return []

    return project.value.medias
        .filter(m => prismic.isFilled.linkToMedia(m.media) && m.media.url)
        .map(mediaGroup => ({
            ...mediaGroup,
            type: endWidthVideoExt(mediaGroup.media.url) ? 'video' : 'other',
        }))
})

const tags = computed(() => {
    if (project.value?.tag_group?.length) return project.value.tag_group.filter(item => item.tag).map(item => item.tag)
    return props.document?.tags || []
})

// Nested route (`[uid].vue`) remounts this component on every `:uid` change (no
// `definePageMeta({ key })`/keepalive), so calling this only when a document exists is safe.
const { prevProject, nextProject } = props.document
    ? useProjectNeighbors(props.document)
    : { prevProject: computed(() => undefined), nextProject: computed(() => undefined) }
</script>

<template>
    <VWindow
        :class="$style.root"
        container-selector="body"
        :aria-label="document?.data.title ?? $t('error_page.not_found_title')"
        @close="navigateTo(backPath)"
    >
        <template #head>
            <h1 :class="$style.title">
                {{ document?.data.title ?? $t('error_page.not_found_title') }}
            </h1>
            <NuxtLink
                :to="backPath"
                :class="$style.back"
                :aria-label="$t('back_to_projects.aria_label')"
            >
                <VIcon name="material-symbols:cancel" />
            </NuxtLink>
        </template>

        <template v-if="document">
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
                        :date="project?.date"
                        format="short"
                    />
                </div>
                <LazyVText
                    v-if="project?.short_description"
                    :content="project.short_description"
                    :class="$style['short-description']"
                />
                <LazyVText
                    v-if="project?.content"
                    :content="project.content"
                    :class="$style.description"
                />
            </div>

            <VPrismicImg :field="project?.thumbnail" />

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
                    :to="withCurrentQuery(prevProject.path)"
                    :class="$style['footer-link']"
                >
                    <VIcon name="material-symbols:arrow-back" />
                    {{ prevProject.title }}
                </NuxtLink>
                <NuxtLink
                    v-if="nextProject"
                    :to="withCurrentQuery(nextProject.path)"
                    :class="[$style['footer-link'], $style['footer-link--next']]"
                >
                    {{ nextProject.title }}
                    <VIcon name="material-symbols:arrow-forward" />
                </NuxtLink>
            </div>
        </template>

        <VErrorContent
            v-else
            :class="$style['not-found']"
            :full-page="false"
            :subtitle="$t('error_status', { code: 404 })"
            :content="$t('error_page.project_not_found_content')"
        >
            <NuxtLink
                :to="backPath"
                :class="$style.button"
            >
                {{ $t('back_home') }}
            </NuxtLink>
        </VErrorContent>
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

.not-found {
    padding: var(--v-project-page-padding-inline);
}

.button {
    padding: 12px 24px;
    border: none;
    border-radius: 9px;
    background-color: var(--color-surface);
    color: var(--color-content);
    cursor: pointer;

    @supports (corner-shape: squircle) {
        border-radius: 24px;
        corner-shape: squircle;
    }
}
</style>
