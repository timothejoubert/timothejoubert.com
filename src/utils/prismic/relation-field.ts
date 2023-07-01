import type { LinkField } from '@prismicio/types/src/value/link'
import { FilledContentRelationshipField } from '@prismicio/types/src/value/contentRelationship'

// CHECK FUNCTION
export function isRelationType(relation: LinkField, type: 'any' | 'Document' | 'Media' | 'Web'): boolean {
    return relation.link_type === type
}

export function isRelationField(link: Partial<LinkField>): boolean {
    return !!link && 'link_type' in link
}

export function isLinkFieldFulled(link: Partial<LinkField>): boolean {
    return !!link && 'url' in link && !!link?.url
}

export const isRelationMediaFulled = (media: LinkField): boolean => {
    return isRelationType(media, 'Media') && 'url' in media
}

export const isInternalRelationLinkFulled = (link: LinkField): boolean => {
    return isRelationType(link, 'Document') && 'id' in link && 'type' in link && 'tags' in link && 'lang' in link
}

export const isInternalRelationLinkWithUidFulled = (link: LinkField): boolean => {
    return isInternalRelationLinkFulled(link) && 'uid' in link && !!link.uid
}

// GET FUNCTION

export function getRelationLinkDocument(link: LinkField): FilledContentRelationshipField | undefined {
    return isInternalRelationLinkFulled(link) ? (link as FilledContentRelationshipField) : undefined
}

export function getRelationLinkUid(link: LinkField): string | undefined {
    return isInternalRelationLinkWithUidFulled(link) ? (link as { uid: string }).uid : undefined
}
