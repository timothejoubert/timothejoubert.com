import { mapRoutePathToPrismicDocument } from '~/utils/prismic/route-resolver'
import { PrismicDocumentType } from '~/constants/prismic-document-type'

export function useMapRouteToPrismicDocument() {
    const route = useRoute()
    return mapRoutePathToPrismicDocument(route.path) || PrismicDocumentType.PROJECT_LISTING
}
