import type { PropType, FunctionalComponent, VNodeChild } from 'vue'
import type { PrismicDocument } from '@prismicio/types'
import { DocumentType } from '~/constants/document-type'
import {
    LazyVProjectListingPage,
    LazyVArchivePage,
    LazyVAboutPage,
    LazyVProjectPage,
} from '#components'

type DocumentTypeValue = (typeof DocumentType)[keyof typeof DocumentType]

interface VPageFactoryProps {
    type: DocumentTypeValue
    document: PrismicDocument
}

function mapNameToComponent(type: DocumentType) {
    switch (type) {
        case DocumentType.PROJECT_LISTING:
            return LazyVProjectListingPage
        case DocumentType.ARCHIVE:
            return LazyVArchivePage
        case DocumentType.ABOUT:
            return LazyVAboutPage
        case DocumentType.PROJECT:
            return LazyVProjectPage
        default:
            return null
    }
}

// TODO: check if import lazy comp is a optimize way
// const isComponent = (component: string) => {
//     return typeof resolveDynamicComponent(component) !== 'string' || typeof resolveComponent(component) !== 'string'
// }

const VPageFactory: FunctionalComponent<VPageFactoryProps> = (props, context): VNodeChild => {
    const component = mapNameToComponent(props.type)

    if (component) {
        return h(component, {
            prismicDocument: props.document,
            type: props.type,
            ...context.attrs,
        })
    }
    else {
        showError({
            status: 404,
            message: `Le composant associé a ce type (${props.type}) de page n'existe pas.`,
        })
        return h('')
    }
}

VPageFactory.props = {
    type: String as PropType<DocumentTypeValue>,
    document: Object as PropType<PrismicDocument>,
}

export default VPageFactory
