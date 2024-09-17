import { mapRoutePathToPrismicDocument } from '~/utils/prismic/route-resolver'
import { DocumentType } from '~/constants/document-type'

export function useRoutePathToPrismicDocument() {
    const route = useRoute()
    return mapRoutePathToPrismicDocument(route.path) || DocumentType.HOME
}
