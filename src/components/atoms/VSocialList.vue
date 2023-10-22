<template>
    <div>
        <slot :socials="socialList" />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import type { VueConstructor } from 'vue'
import IconFacebook from '~/assets/images/icons/social-facebook.svg?sprite'
import IconGithub from '~/assets/images/icons/social-github.svg?sprite'
import IconTwitter from '~/assets/images/icons/social-twitter.svg?sprite'
import IconInstagram from '~/assets/images/icons/social-instagram.svg?sprite'
import IconYoutube from '~/assets/images/icons/social-youtube.svg?sprite'
import IconLinkedin from '~/assets/images/icons/social-linkedin.svg?sprite'
import IconBehance from '~/assets/images/icons/social-behance.svg?sprite'
import IconVimeo from '~/assets/images/icons/social-vimeo.svg?sprite'
import IconTikTok from '~/assets/images/icons/social-tiktok.svg?sprite'
import { SettingsDocumentData } from '~~/prismicio-types'

export interface SocialsContent {
    name: string
    tagIcon: VueConstructor | string
    url: string
    label?: string
}

export interface ExternalLink {
    link_type: string
    url: string
}

export type Social = {
    social?: string | null
    link?: ExternalLink
    label?: string | null
}

const getSocialIcon = (name?: string | null): VueConstructor | string => {
    if (!name) return ''

    switch (name.toLowerCase()) {
        case 'github':
            return IconGithub
        case 'instagram':
            return IconInstagram
        case 'facebook':
            return IconFacebook
        case 'twitter':
            return IconTwitter
        case 'tiktok':
            return IconTikTok
        case 'vimeo':
            return IconVimeo
        case 'behance':
            return IconBehance
        case 'youtube':
            return IconYoutube
        case 'linkedin':
            return IconLinkedin
        default:
            return ''
    }
}

export function getSocialsData(socialsList: SettingsDocumentData['socials'] | undefined): SocialsContent[] {
    if (!socialsList?.length) return []

    return socialsList?.map((item) => {
        const { social, link, label } = item
        return {
            url: (link as { url?: string })?.url || '',
            name: social || '',
            tagIcon: getSocialIcon(social),
            label: label || '',
        }
    })
}

export default Vue.extend({
    name: 'VSocialList',
    computed: {
        socialList(): SocialsContent[] {
            const socials = this.$store.getters.settings?.data?.socials

            if (socials?.length) return getSocialsData(socials)
            else return []
        },
    },
})
</script>
