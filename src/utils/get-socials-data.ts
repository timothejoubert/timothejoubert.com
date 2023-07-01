import type { VueConstructor } from 'vue'
import IconFacebook from '~/assets/images/icons/social-facebook.svg?sprite'
import IconTwitter from '~/assets/images/icons/social-twitter.svg?sprite'
import IconInstagram from '~/assets/images/icons/social-instagram.svg?sprite'
import IconYoutube from '~/assets/images/icons/social-youtube.svg?sprite'
import IconLinkedin from '~/assets/images/icons/social-linkedin.svg?sprite'
import IconBehance from '~/assets/images/icons/social-behance.svg?sprite'
// import IconVimeo from '~/assets/images/icons/social-vimeo.svg?sprite'

export interface SocialsContent {
    tagIcon: VueConstructor | string
    name: string
    url: string
}

export interface ExternalLink {
    link_type: string
    url: string
}

export type Social = {
    name: string | null
    link?: ExternalLink
}

const getSocialIcon = (name: string | null): VueConstructor | string => {
    if (!name) return ''

    switch (name.toLowerCase()) {
        case 'facebook':
            return IconFacebook
        case 'twitter':
            return IconTwitter
        case 'instagram':
            return IconInstagram
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

export function getSocialsData(socialsList: Social[] | undefined): SocialsContent[] {
    if (!socialsList?.length) return []

    return socialsList
        .map((item) => {
            const { name, link } = item
            return { url: link?.url || '', name: name || '', tagIcon: getSocialIcon(name) }
        })
        .filter((item) => !!item)
}
