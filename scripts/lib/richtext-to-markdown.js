const HEADING_LEVEL = {
    heading1: '#',
    heading2: '##',
    heading3: '###',
    heading4: '####',
    heading5: '#####',
    heading6: '######',
}

const LIST_ITEM_TYPES = new Set(['list-item', 'o-list-item'])

function resolveLinkUrl(data) {
    if (!data) return ''
    if (data.url) return data.url
    if (data.link_type === 'Document' && data.uid) return `/${data.uid}`
    return ''
}

function applySpans(text, spans = []) {
    if (!spans.length) return text

    const sorted = [...spans].sort((a, b) => a.start - b.start)
    let result = ''
    let cursor = 0

    for (const span of sorted) {
        result += text.slice(cursor, span.start)
        const spanText = text.slice(span.start, span.end)

        if (span.type === 'strong') result += `**${spanText}**`
        else if (span.type === 'em') result += `_${spanText}_`
        else if (span.type === 'hyperlink') result += `[${spanText}](${resolveLinkUrl(span.data)})`
        else if (span.type === 'label') result += spanText
        else result += spanText

        cursor = span.end
    }

    result += text.slice(cursor)
    return result
}

function serializeNode(node, warnings) {
    if (HEADING_LEVEL[node.type]) {
        return `${HEADING_LEVEL[node.type]} ${applySpans(node.text, node.spans)}`
    }

    if (node.type === 'paragraph') {
        return applySpans(node.text, node.spans)
    }

    if (node.type === 'preformatted') {
        return `\`\`\`\n${node.text}\n\`\`\``
    }

    warnings.push(`Unhandled RichText node type "${node.type}", falling back to raw text.`)
    return node.text ?? ''
}

export function richTextToMarkdown(richText, warnings = []) {
    if (!Array.isArray(richText) || richText.length === 0) return ''

    const blocks = []
    let currentList = null

    for (const node of richText) {
        if (LIST_ITEM_TYPES.has(node.type)) {
            const marker = node.type === 'o-list-item' ? '1.' : '-'
            if (!currentList || currentList.marker !== marker) {
                currentList = { marker, lines: [] }
                blocks.push(currentList)
            }
            currentList.lines.push(`${marker} ${applySpans(node.text, node.spans)}`)
            continue
        }

        currentList = null
        blocks.push(serializeNode(node, warnings))
    }

    return blocks
        .map(block => (typeof block === 'string' ? block : block.lines.join('\n')))
        .join('\n\n')
}
