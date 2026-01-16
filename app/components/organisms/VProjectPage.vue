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
</script>

<template>
    <div :class="$style.root">
        <LazyVMainProjectListing
            :class="$style.projects"
        />
        <main :class="$style.project">
            <div :class="$style.head">
                <h1 :class="$style.title">
                    {{ document.data.title }}
                </h1>
                <VPrismicLink
                    :to="prismicDocumentRoute.home_page"
                    :class="$style.back"
                    :aria-label="$t('back_to_projects.aria_label')"
                >
                    <VIcon name="corner-up-left-alt" />
                </VPrismicLink>
            </div>
            <div
                :class="$style.attributes"
            >
                <template v-if="tags.length">
                    <LazyVTag
                        v-for="(tag, i) in tags"
                        :key="tag || i"
                        :label="tag"
                    />
                </template>
                <VTime
                    :date="project.date"
                    format="full"
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
}

.projects{
    position: sticky;
    top: 16px;
    grid-column: 1 / -1;
    grid-row: 1;
}

.project {
    --v-project-page-padding-inline: 16px;

    z-index: 11;
    width: 100%;
    min-height: var(--app-inner-max-height);
    padding-bottom: 200px;
    border-radius: 8px 0 0 8px;
    border-left: 1PX solid color-mix(in hsl, var(--color-background), transparent 50%);
    background-color: var(--color-background);
    box-shadow: -13px -16px 16px 12px  color-mix(in hsl, var(--color-surface), transparent 30%);
    grid-column: 2 / -1;
    grid-row: 1;
    padding-inline: var(--v-project-page-padding-inline);
}

.head {
    position: relative;
    left: calc(var(--v-project-page-padding-inline) * -1);
    display: flex;
    width: calc(100% + var(--v-project-page-padding-inline) * 2);
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;

    // background-color: color-mix(in hsl, var(--color-background), transparent 50%);
    background-color: var(--color-accent);
    color: var(--color-surface);
    gap: 12px;
    padding-block: 4px;
    padding-inline: var(--v-project-page-padding-inline);
}

.title {
    font-size: 18px;
    margin-block: initial;
}

.back {
    color: inherit;
}

.attributes {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    gap: 16px;
}

.short-description {
    margin-top: 16px;
}

.description {
    margin-top: 16px;
}

.media {
    margin-block: 12px;
}
</style>
