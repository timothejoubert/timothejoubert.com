import { marked } from 'marked'
import { htmlAsRichText } from '@prismicio/migrate'

export function markdownToRichText(markdown, { resolveImage } = {}) {
    if (!markdown?.trim()) return { result: [], warnings: [] }

    const html = marked.parse(markdown, { async: false })

    return htmlAsRichText(html, {
        serializer: resolveImage
            ? {
                    img: ({ node }) => ({
                        type: 'image',
                        id: resolveImage(node.properties.src, node.properties.alt),
                    }),
                }
            : undefined,
    })
}
