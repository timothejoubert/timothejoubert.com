<template>
    <div v-if="url" :class="rootClasses">
        <video v-bind="props" ref="media" :class="$style.video" @click.prevent="onClick" @canplay="onVideoReady">
            <source :src="url" type="video/mp4" />
        </video>
        <v-button v-if="soundEnabled" filled :class="$style.cta" @click.prevent="onSoundClick">
            <template #icon>
                <component :is="soundState === 'on' ? 'IconSoundOff' : 'IconSoundOn'" />
            </template>
        </v-button>
        <v-button
            v-if="!background"
            v-show="videoState !== 'played'"
            filled
            :class="$style.cta"
            @click.prevent="onClick"
        >
            <template #icon>
                <icon-play />
            </template>
        </v-button>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import IconPlay from '~/assets/images/icons/play.svg?sprite'
import IconSoundOn from '~/assets/images/icons/sound-on.svg?sprite'
import IconSoundOff from '~/assets/images/icons/sound-off.svg?sprite'
import { PrismicMedia } from '~/types/prismic/app-prismic'

export interface VVideoProps {
    prismicMedia: PrismicMedia
    autoplay?: boolean
    cover?: boolean
    controls?: boolean
    needInteraction?: boolean
    background?: boolean
    soundEnabled?: boolean
}

export type VideoState = 'pending' | 'ready' | 'played' | 'paused' | 'ended'
export type SoundState = 'muted' | 'on' | 'off'

export default Vue.extend({
    name: 'VVideo',
    components: { IconPlay, IconSoundOn, IconSoundOff },
    props: {
        prismicMedia: Object as PropType<PrismicMedia>,
        autoplay: Boolean,
        cover: Boolean,
        controls: { type: Boolean, default: true },
        needInteraction: Boolean,
        background: Boolean,
        soundEnabled: Boolean,
    },
    data() {
        return {
            videoState: 'pending' as VideoState,
            soundState: 'muted' as SoundState,
        }
    },
    computed: {
        rootClasses(): (undefined | false | string)[] {
            return [
                this.$style.root,
                this.needInteraction && this.$style['root--need-interaction'],
                (this.cover || this.background) && this.$style['root--cover'],
            ]
        },
        url(): string | undefined | null {
            return (this.prismicMedia as { url?: string | null })?.url
        },
        props(): Record<string, any> {
            const props: Record<string, any> = {}

            if (this.autoplay || this.background) {
                props.autoplay = true
                props.muted = true
                props.loop = true
                props.preload = 'auto'
            }
            if (this.cover || this.background) props['data-object-fit'] = 'cover'
            if (this.controls && !this.background) props.controls = true

            return props
        },
    },
    watch: {
        soundState(state: SoundState) {
            const vid = this.$refs.media as HTMLVideoElement
            vid.muted = state !== 'on'
        },
    },
    methods: {
        onClick() {
            if (this.background) return
            if (this.videoState === 'played') this.pause()
            else this.play()
            this.$emit('video-state', this.videoState)
        },
        onSoundClick() {
            if (this.soundState === 'muted' || this.soundState === 'off') this.soundState = 'on'
            else if (this.soundState === 'on') this.soundState = 'off'
        },
        play() {
            ;(this.$refs.media as HTMLVideoElement).play()
            this.videoState = 'played'
        },
        pause() {
            ;(this.$refs.media as HTMLVideoElement).pause()
            this.videoState = 'paused'
        },
        onVideoReady() {
            this.videoState = 'ready'
        },
    },
})
</script>
<style lang="scss" module>
.root {
    position: relative;
    overflow: var(--v-image-overflow);
    border-radius: var(--v-image-border-radius);

    &--need-interaction {
        cursor: pointer;
    }

    &--cover {
        width: 100%;
        height: auto;
    }
}

.video {
    overflow: hidden;
    border-radius: var(--v-image-border-radius, 0);

    .root--cover & {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.cta {
    position: absolute;
    right: rem(16);
    bottom: rem(16);
}
</style>
