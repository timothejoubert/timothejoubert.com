import { mapRoutePathToPrismicDocument } from '~/utils/prismic/route-resolver'
import { DocumentType } from '~/constants/document-type'

export function useMapRouteToPrismicDocument() {
    const route = useRoute()
    return mapRoutePathToPrismicDocument(route.path) || DocumentType.PROJECT_LISTING
}
