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
        <header>
            <h1>Project page | {{ document.data.title }}</h1>
            <VPrismicLink :to="prismicDocumentRoute.home_page">
                Retour
            </VPrismicLink>
            <template v-if="tags.length">
                <button
                    v-for="(tag, i) in tags"
                    :key="tag || i"
                >
                    {{ tag }}
                </button>
            </template>
            <VTime
                :date="project.date"
                format="full"
            />
            <VText
                v-if="project.short_description"
                :content="project.short_description"
            />
            <VText
                v-if="project.content"
                :content="project.content"
            />
            <VPrismicImg
                :field="project.thumbnail"
            />
        </header>

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
    position: absolute;
    z-index: 11;
    top: 0;
    right: 0;
    width: 50vw;
    min-height: 100svh;
    background-color: white;
}

.media {
    margin-block: 12px;
}
</style>
