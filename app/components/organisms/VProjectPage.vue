<script lang="ts" setup>
import { withQuery } from 'ufo'
import type { ProjectDocument } from '~~/prismicio-types'
import { isFilled } from '@prismicio/client'

const props = defineProps<{
    document?: ProjectDocument | null
    backPath: string
}>()

const { phase } = usePageIntro()
const revealed = computed(() => phase.value === 'page' || phase.value === 'done')

// One-shot: whatever direction the previous project's prev/next link set is consumed right away
// so a future remount (e.g. browser back/forward, direct URL) doesn't replay a stale slide.
const switchDirection = useProjectSwitchDirection()
const enterDirection = switchDirection.value
switchDirection.value = null

const contentMounted = ref(false)
onMounted(async () => {
    await nextTick()
    contentMounted.value = true
})

const route = useRoute()

// Keeps the current query (e.g. VArchivePage's sort) when navigating between projects,
// otherwise it gets dropped and the listing behind the modal resets/refetches.
function withCurrentQuery(path: string) {
    return withQuery(path, route.query)
}

const project = computed(() => props.document?.data)

const mainExternalLink = computed(() => {
    if (isFilled.link(project.value?.link)) {
        return project.value?.link
    }

    return null
})

const awardLinks = computed(() => {
    if (!project.value) return []

    return project.value.awards
        .filter(a => isFilled.link(a.link) && a.link.url)
        .map(a => a.link)
})

const videoExtensions = ['mp4', 'mov']
function endWidthVideoExt(url: string) {
    const afterLastDot = url.substring(url?.lastIndexOf('.'))
    return videoExtensions.some(ext => afterLastDot.startsWith('.' + ext))
}

const medias = computed(() => {
    if (!project.value) return []

    return project.value.medias
        .filter(m => isFilled.linkToMedia(m.media) && m.media.url)
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
        :class="[$style.root, revealed && $style['root--visible']]"
        :aria-label="document?.data.title ?? $t('error_page.not_found_title')"
        @close="navigateTo(backPath)"
    >
        <template #head>
            <h1
                class="text-h4"
                :class="$style.title"
            >
                {{ document?.data.title ?? $t('error_page.not_found_title') }}
            </h1>
            <NuxtLink
                :to="backPath"
                :class="$style.back"
                :aria-label="$t('back_to_projects.aria_label')"
                @pointerdown.stop
            >
                <VIcon name="material-symbols:cancel" />
            </NuxtLink>
        </template>

        <template v-if="document">
            <div
                :class="[
                    $style['content-wrapper'],
                    contentMounted && $style['content-wrapper--visible'],
                    enterDirection && $style[`content-wrapper--from-${enterDirection}`],
                ]"
            >
                <div :class="$style.content">
                    <div :class="$style.attributes">
                        <ul
                            v-if="tags.length"
                            :class="$style.tags"
                        >
                            <LazyVTag
                                v-for="(tag, i) in tags"
                                :key="tag || i"
                                :label="tag"
                                wrapper="li"
                            />
                        </ul>
                        <VPrismicLink
                            v-if="mainExternalLink"
                            :to="mainExternalLink"
                            :class="$style.link"
                        >
                            {{ mainExternalLink.text ?? $t('project_link') }}
                            <VIcon name="material-symbols:north-east" />
                        </VPrismicLink>
                        <ul
                            v-if="awardLinks.length"
                            :class="$style.awards"
                        >
                            <li
                                v-for="(award, index) in awardLinks"
                                :key="`award-${index}`"
                                :class="$style['awards__item']"
                            >
                                <VPrismicLink
                                    :to="award"
                                    :class="$style.awards__link"
                                    :aria-label="award.text ?? $t('award_link')"
                                >
                                    <VIcon name="material-symbols:trophy" />
                                </VPrismicLink>
                            </li>
                        </ul>

                        <VTime
                            :date="project?.date"
                            format="short"
                            :class="$style.date"
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

                <VPrismicImg
                    :field="project?.thumbnail"
                    sizes="xs:92vw sm:92vw md:30vw lg:42vw xl:42vw hq:42vw qhd:42vw"
                />

                <div
                    v-if="medias.length"
                    :class="$style.medias"
                >
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
                        <VPrismicImg
                            v-else
                            :field="mediaGroup.media"
                        />
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
                        @click="switchDirection = 'prev'"
                    >
                        <VIcon name="material-symbols:arrow-back" />
                        {{ prevProject.title }}
                    </NuxtLink>
                    <NuxtLink
                        v-if="nextProject"
                        :to="withCurrentQuery(nextProject.path)"
                        :class="[$style['footer-link'], $style['footer-link--next']]"
                        @click="switchDirection = 'next'"
                    >
                        {{ nextProject.title }}
                        <VIcon name="material-symbols:arrow-forward" />
                    </NuxtLink>
                </div>
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
    left: var(--app-padding-left);
    overflow: hidden auto;
    max-width: var(--app-inner-max-width);
    max-height: var(--app-inner-max-height);
    opacity: 0;
    overscroll-behavior: contain;
    scrollbar-width: none;
    translate: 0 24px;

    @include media('>=md') {
        left: initial;
        width: 50%;
    }

    @media (prefers-reduced-motion: no-preference) {
        transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
    }

    &--visible {
        opacity: 1;
        translate: 0 0;
    }
}

.title {
    margin-block: initial;
    padding-block: 8px;
    padding-inline: var(--v-project-page-padding-inline);
}

.content-wrapper {
    opacity: 0;

    &--from-prev {
        translate: -40px 0;
    }

    &--from-next {
        translate: 40px 0;
    }

    @media (prefers-reduced-motion: no-preference) {
        transition: opacity 0.4s ease(out-quad), translate 0.4s ease(out-quad);
    }

    &--visible {
        opacity: 1;
        translate: 0 0;
    }
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
    gap: 14px;
    padding-block: 8px;
}

.tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    gap: 10px;
    list-style: none;
}

.link {
    display: inline-flex;
    align-items: center;
    color: var(--color-content);
    gap: 3px;
    text-underline-offset: 2px;

    :global(.iconify) {
        font-size: 14px;
    }
}

.link,
.awards__link {
    color: var(--color-content);
    transition: color 0.3s ease(out-quad);

    &:focus-visible {
        color: var(--color-accent);
    }

    @media (hover: 'hover') {
        &:hover {
            color: var(--color-accent);
        }
    }
}

.awards {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
    list-style: none;
}

.awards__link {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
}

.date {
    margin-left: auto;
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
