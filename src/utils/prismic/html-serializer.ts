import { PrismicDocument } from '@prismicio/types/src/value/document'

export default function htmlSerializer(type: string, element: PrismicDocument, _content: unknown, children: unknown[]) {
    switch (type) {
        case 'heading1':
            return /* html */ `<h1 class="text-h1">${children.join('')}</h1>`

        case 'heading2':
            return /* html */ `<h2 class="text-h2">${children.join('')}</h2>`

        case 'heading3':
            return /* html */ `<h3 class="text-h3">${children.join('')}</h3>`

        case 'paragraph':
            return /* html */ `<p>${children.join('')}</p>`

        case 'group-o-list-item':
            return /* html */ `<ol>${children.join('')}</ol>`

        case 'o-list-item':
            return /* html */ `<li>${children.join('')}</li>`

        case 'group-list-item':
            return /* html */ `<ul>${children.join('')}</ul>`

        case 'list-item':
            return /* html */ `<li>${children.join('')}</li>`

        case 'preformatted':
            return /* html */ `<pre>
                <code>${children.join('')}</code>
            </pre>`

        case 'strong':
            return /* html */ `<strong class="font-semibold">${children.join('')}</strong>`

        case 'hyperlink':
            return /* html */ `<a href="${element.data.url}">${children.join('')}</a>`

        default:
            return null
    }
}
