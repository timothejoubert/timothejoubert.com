<script lang="ts" setup>
import type { ProjectDocument } from '~~/prismicio-types'
import { prismicDocumentRoute } from '~~/shared/prismic-routes'
import VPrismicImg from '../atoms/VPrismicImg.vue'
import VVideoPlayer from '../atoms/VVideoPlayer.vue'

const props = defineProps<{
	document: ProjectDocument
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
		.map((mediaGroup) => {
			return {
				...mediaGroup,
				type: endWidthVideoExt(mediaGroup.media.url) ? 'video' : 'other',
			}
		})
})

const tags = computed(() => {
	if (project.value.tag_group?.length) return project.value.tag_group.filter(item => item.tag).map(item => item.tag)
	return props.document.tags || []
})

const projectEl = useTemplateRef<HTMLElement>('projectRef')
const headEl = useTemplateRef<HTMLElement>('headRef')
const rootEl = useTemplateRef<HTMLElement>('rootRef')

const { style } = useDraggable(projectEl, {
    handle: headEl,
    containerElement: rootEl
})
</script>

<template>
    <div :class="$style.root" ref="rootRef">
        <LazyVMainProjectListing
            :class="$style.projects"
        />
        <main :class="$style.project" ref="projectRef" :style="style">
            <div :class="$style.head" ref="headRef">
                <h1 :class="$style.title">
                    {{ document.data.title }}
                </h1>
                <VPrismicLink
                    :to="prismicDocumentRoute.home_page"
                    :class="$style.back"
                    :title="$t('back_to_projects.aria_label')"
                >
                    <VIcon prefix="material-symbols" name="cancel" />
                </VPrismicLink>
            </div>

            <div :class="$style.content">
                <div
                    :class="$style.attributes"
                >
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

            <VPrismicImg
                :field="project.thumbnail"
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
        </main>
    </div>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
}

.projects {
    position: sticky;
    top: 16px;
    grid-column: 1 / -1;
    grid-row: 1;
}

.project {
    --v-project-page-padding-inline: 16px;

    position: fixed;
    z-index: 11;
    width: 100%;
    max-height: var(--app-inner-max-height);
    overflow: auto;
    padding-bottom: 200px;
    border-radius: 12px;
    background-color: var(--color-background);
    // box-shadow: -13px -16px 16px 12px  color-mix(in hsl, var(--color-surface), transparent 30%);
    grid-column: 2 / -1;
    width: 50%;
    grid-row: 1;
    border: 1PX solid var(--color-surface);
    // background-color: var(--color-surface);

    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */

    &::-webkit-scrollbar {
        display: none;
    }
}

.head {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: -1PX;
    background-color: var(--color-surface);
    color: var(--color-content);
    gap: 12px;
    border-radius: inherit;
    padding-block: 12px;
    padding-inline: var(--v-project-page-padding-inline);

    // Hide border-radius on top of the project page
    &::before {
        position: absolute;
        content: '';
        display: block;
        top: -3px;
        left: -5px;
        right: -5px;
        height: 15px;
        background-color: var(--color-surface);
        pointer-events: none;
    }
}

.title {
    font-size: 18px;
    margin-block: initial;
}

.back {
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    font-size: 22px;
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
    gap: inherit;
    margin: 0;
    padding: 0;
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
</style>
