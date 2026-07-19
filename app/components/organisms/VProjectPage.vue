<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { ProjectDocument } from '~~/prismicio-types'
import VPrismicImg from '../atoms/VPrismicImg.vue'
import VVideoPlayer from '../atoms/VVideoPlayer.vue'

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

// --- Refs ---
const projectEl = useTemplateRef<HTMLElement>('projectRef')
const headEl = useTemplateRef<HTMLElement>('headRef')
const wrapper = ref<HTMLElement | null>(null)
onMounted(() => {
	wrapper.value = document.body.querySelector('#__nuxt') as HTMLElement || null
})

// --- Drag ---
const savedPosition = useState<{ x: number, y: number } | undefined>('project-modal-drag-position', () => undefined)
const hasDragged = ref(!!savedPosition.value)

const { x, y, isDragging } = useDraggable(projectEl, {
	handle: headEl,
	containerElement: wrapper,
	...(savedPosition.value && { initialValue: savedPosition.value }),
})

watch(isDragging, (dragging) => {
	if (dragging) hasDragged.value = true
})

watch([x, y], ([newX, newY]) => {
	if (hasDragged.value) savedPosition.value = { x: newX, y: newY }
})

// --- Resize ---
type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'

const MIN_WIDTH = 300
const MIN_HEIGHT = 200

const savedSize = useState<{ width: number, height: number } | undefined>('project-modal-size', () => undefined)
const currentWidth = ref(savedSize.value?.width ?? 0)
const currentHeight = ref(savedSize.value?.height ?? 0)
const hasResized = ref(!!savedSize.value)
const isResizing = ref(false)

const CURSOR_MAP: Record<ResizeDirection, string> = {
	n: 'n-resize', ne: 'ne-resize', e: 'e-resize', se: 'se-resize',
	s: 's-resize', sw: 'sw-resize', w: 'w-resize', nw: 'nw-resize',
}

function startResize(event: PointerEvent, direction: ResizeDirection) {
	event.preventDefault()
	event.stopPropagation()

	const el = projectEl.value
	if (!el) return

	const containerRect = wrapper.value?.getBoundingClientRect() ?? { left: 0, top: 0 }
	const rect = el.getBoundingClientRect()

	const startPointerX = event.clientX
	const startPointerY = event.clientY
	const startWidth = rect.width
	const startHeight = rect.height
	const startLeft = rect.left - containerRect.left
	const startTop = rect.top - containerRect.top

	// On first resize, initialize both dimensions from the actual DOM size
	// so the non-resized axis doesn't collapse to 0
	if (!hasResized.value) {
		currentWidth.value = startWidth
		currentHeight.value = startHeight
	}

	// Sync x/y with actual DOM position before modifying them
	if (direction.includes('w') || direction.includes('n')) {
		x.value = startLeft
		y.value = startTop
		hasDragged.value = true
	}

	// Max dimensions: space between current edge and container boundary
	const containerWidth = containerRect.width
	const containerHeight = containerRect.height
	const maxWidthEast = containerWidth - startLeft          // right edge can't exceed container width
	const maxWidthWest = startLeft + startWidth              // left edge can't go below 0
	const maxHeightSouth = containerHeight - startTop        // bottom edge can't exceed container height
	const maxHeightNorth = startTop + startHeight            // top edge can't go above 0

	isResizing.value = true
	document.body.style.userSelect = 'none'
	document.body.style.cursor = CURSOR_MAP[direction]

	const onMove = (e: PointerEvent) => {
		const dx = e.clientX - startPointerX
		const dy = e.clientY - startPointerY

		if (direction.includes('e')) {
			currentWidth.value = Math.min(Math.max(MIN_WIDTH, startWidth + dx), maxWidthEast)
		}
		if (direction.includes('s')) {
			currentHeight.value = Math.min(Math.max(MIN_HEIGHT, startHeight + dy), maxHeightSouth)
		}
		if (direction.includes('w')) {
			const newWidth = Math.min(Math.max(MIN_WIDTH, startWidth - dx), maxWidthWest)
			currentWidth.value = newWidth
			x.value = startLeft + (startWidth - newWidth)
		}
		if (direction.includes('n')) {
			const newHeight = Math.min(Math.max(MIN_HEIGHT, startHeight - dy), maxHeightNorth)
			currentHeight.value = newHeight
			y.value = startTop + (startHeight - newHeight)
		}

		hasResized.value = true
	}

	const onUp = () => {
		isResizing.value = false
		document.body.style.userSelect = ''
		document.body.style.cursor = ''

		savedSize.value = { width: currentWidth.value, height: currentHeight.value }
		if (hasDragged.value) savedPosition.value = { x: x.value, y: y.value }

		window.removeEventListener('pointermove', onMove)
		window.removeEventListener('pointerup', onUp)
	}

	window.addEventListener('pointermove', onMove)
	window.addEventListener('pointerup', onUp)
}

// --- Combined style ---
const elementStyle = computed<CSSProperties>(() => ({
	...(hasDragged.value && { left: `${x.value}px`, top: `${y.value}px` }),
	...(hasResized.value && {
		width: `${currentWidth.value}px`,
		height: `${currentHeight.value}px`,
		maxHeight: 'none',
	}),
}))
</script>

<template>
	<div
		ref="projectRef"
		:class="[$style.root, isResizing && $style['root--resizing']]"
		:style="elementStyle"
	>
		<div :class="$style['resize-handle--n']" @pointerdown.stop="startResize($event, 'n')" />
		<div :class="$style['resize-handle--ne']" @pointerdown.stop="startResize($event, 'ne')" />
		<div :class="$style['resize-handle--e']" @pointerdown.stop="startResize($event, 'e')" />
		<div :class="$style['resize-handle--se']" @pointerdown.stop="startResize($event, 'se')" />
		<div :class="$style['resize-handle--s']" @pointerdown.stop="startResize($event, 's')" />
		<div :class="$style['resize-handle--sw']" @pointerdown.stop="startResize($event, 'sw')" />
		<div :class="$style['resize-handle--w']" @pointerdown.stop="startResize($event, 'w')" />
		<div :class="$style['resize-handle--nw']" @pointerdown.stop="startResize($event, 'nw')" />

		<div :class="$style.inner">
			<div :class="$style.head" ref="headRef">
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
			</div>

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
		</div>
	</div>
</template>

<style lang="scss" module>
$handle-edge: 4px;
$handle-corner: 10px;

.root {
	--v-project-page-padding-inline: 16px;

	position: absolute;
	z-index: 11;
	top: var(--app-padding-top);
	right: var(--app-padding-right);
	width: 50%;
	max-height: var(--app-inner-max-height);
	border-radius: 12px;
	background-color: var(--color-background);
	border: 1PX solid var(--color-surface);
	overflow: hidden;

	&--resizing {
		pointer-events: none;

		// Re-enable pointer events only on resize handles during resize
		[class*='resize-handle'] {
			pointer-events: auto;
		}
	}
}

.inner {
	width: 100%;
	height: 100%;
	overflow: auto;
	padding-bottom: 200px;

	-ms-overflow-style: none;
	scrollbar-width: none;

	&::-webkit-scrollbar {
		display: none;
	}
}

// Resize handles
[class*='resize-handle--'] {
	position: absolute;
	z-index: 10;
}

.resize-handle--n  { top: 0; left: $handle-corner; right: $handle-corner; height: $handle-edge; cursor: n-resize; }
.resize-handle--s  { bottom: 0; left: $handle-corner; right: $handle-corner; height: $handle-edge; cursor: s-resize; }
.resize-handle--e  { top: $handle-corner; right: 0; bottom: $handle-corner; width: $handle-edge; cursor: e-resize; }
.resize-handle--w  { top: $handle-corner; left: 0; bottom: $handle-corner; width: $handle-edge; cursor: w-resize; }
.resize-handle--ne { top: 0; right: 0; width: $handle-corner; height: $handle-corner; cursor: ne-resize; }
.resize-handle--nw { top: 0; left: 0; width: $handle-corner; height: $handle-corner; cursor: nw-resize; }
.resize-handle--se { bottom: 0; right: 0; width: $handle-corner; height: $handle-corner; cursor: se-resize; }
.resize-handle--sw { bottom: 0; left: 0; width: $handle-corner; height: $handle-corner; cursor: sw-resize; }

.head {
	position: sticky;
	cursor: move;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: -1PX;
	background-color: var(--color-surface);
	color: var(--color-content);
	gap: 12px;
	border-radius: inherit inherit 0 0;
	padding-block: 8px;
	padding-inline: var(--v-project-page-padding-inline);

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
