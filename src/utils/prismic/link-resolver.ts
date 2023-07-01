import { Document } from '@prismicio/client/types/documents'
import DocumentUid from '../../constants/document-uid'
// import CustomType from '../../constants/custom-type'

export default function linkResolver({ uid, type }: Document) {
    if (uid === DocumentUid.HOME) return '/'
    // if (type === CustomType.PROJECT) return `/${DocumentUid.PROJECT_LISTING}/${uid}`
    // if (type === CustomType.PROJECT) return `/${NodeUid.PROJECT_LISTING}/${uid}`

    return `/${uid}`
}
