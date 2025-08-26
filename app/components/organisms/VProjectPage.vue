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
        <div :class="$style.head">
            <h1 :class="$style.title">
                {{ document.data.title }}
            </h1>
            <VPrismicLink
                :to="prismicDocumentRoute.home_page"
                :class="$style.back"
                :aria-label="$t('back_to_projects.aria_label')"
            >
                <VIcon
                    name="uil:corner-up-left-alt"
                    size="1.6em"
                />
            </VPrismicLink>
        </div>
        <hr :class="$style.hr">
        <div
            v-if="tags.length"
            :class="$style.tags"
        >
            <VTag
                v-for="(tag, i) in tags"
                :key="tag || i"
                :label="tag"
            />
            <VTime
                :date="project.date"
                format="full"
            />
            <VText
                v-if="project.short_description"
                :content="project.short_description"
                :class="$style['short-description']"
            />
            <VText
                v-if="project.content"
                :content="project.content"
                :class="$style.description"
            />
            <VPrismicImg
                :field="project.thumbnail"
            />
        </div>

        <main>
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
                        v-if="mediaGroup.type === 'video'"
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
    // position: absolute;
    // z-index: 11;
    // top: 0;
    // right: 0;
    // width: 50vw;
    position: relative;
    min-height: var(--app-max-height);
    max-height: var(--app-max-height);
    // padding-inline: var(--gutter);
    // padding: var(--gutter) 0 var(--gutter) var(--gutter);
    border-radius: 8px;
    overflow-y: auto;
    background-color: var(--color-surface);
    border-left: 1PX solid color-mix(in hsl, var(--color-background), transparent 50%);
    // scrollbar-width: none;

    // isolation: isolate;
    // scrollbar-gutter: stable;

    // &::before {
    //     position: absolute;
    //     content: '';
    //     inset: 0 0 0 -50vw;
    //     background-color: rgba(0, 0, 0, 0.3);
    //     z-index: -1;
    // }
}

.head {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    padding: 8px;
    gap: 12px;
    background-color: color-mix(in hsl, var(--color-background), transparent 50%);
}

.title {
    margin-block: initial;
    font-size: 22px;
}

.back {
    color: inherit;
}

.hr {
    border: 0;
    // border-top: 1px solid red;
    width: 100%;
}

.tags {
    display: flex;
    flex-wrap: wrap;
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
