import * as prismic from '@prismicio/client'
import { dump as dumpYaml } from 'js-yaml'
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join, extname } from 'node:path'
import { richTextToMarkdown } from './lib/richtext-to-markdown.js'

const config = JSON.parse(readFileSync(join(process.cwd(), 'prismic.config.json'), 'utf-8'))
const REPOSITORY = config.repositoryName

if (!REPOSITORY) {
    console.error('No repositoryName found in prismic.config.json')
    process.exit(1)
}

const OUTPUT_DIR = join(process.cwd(), 'projects-source')

const accessToken = process.env.PRISMIC_ACCESS_TOKEN

const client = prismic.createClient(REPOSITORY, {
    ...(accessToken ? { accessToken } : {}),
})

function extensionFromMediaField(field, fallbackResponse) {
    const nameExt = field?.name ? extname(field.name) : ''
    if (nameExt) return nameExt

    const contentType = fallbackResponse?.headers.get('content-type')
    if (contentType?.includes('/')) return `.${contentType.split('/')[1].split(';')[0]}`

    return ''
}

async function downloadMedia(field, destPath, warnings) {
    if (!field?.url) return null

    try {
        const response = await fetch(field.url)
        if (!response.ok) {
            warnings.push(`Failed to download media "${field.url}" (HTTP ${response.status})`)
            return null
        }

        const ext = extensionFromMediaField(field, response)
        const finalPath = `${destPath}${ext}`
        const buffer = Buffer.from(await response.arrayBuffer())
        writeFileSync(finalPath, buffer)

        return finalPath
    }
    catch (error) {
        warnings.push(`Failed to download media "${field.url}": ${error.message}`)
        return null
    }
}

function toRelativePath(absoluteMediaPath, projectDir) {
    return absoluteMediaPath.slice(projectDir.length + 1)
}

async function buildProjectArchive(doc, warnings) {
    const data = doc.data
    const projectDir = join(OUTPUT_DIR, doc.uid)
    const mediaDir = join(projectDir, 'media')
    mkdirSync(mediaDir, { recursive: true })

    const thumbnailPath = await downloadMedia(data.thumbnail, join(mediaDir, 'thumbnail'), warnings)
    const metaImagePath = data.meta_image?.url
        ? await downloadMedia(data.meta_image, join(mediaDir, 'meta-image'), warnings)
        : null

    const medias = []
    for (const [index, item] of (data.medias ?? []).entries()) {
        const entry = { sound_enabled: item.sound_enabled ?? false }

        if (item.media?.url) {
            const mediaPath = await downloadMedia(item.media, join(mediaDir, `media-${index}`), warnings)
            entry.file = mediaPath ? toRelativePath(mediaPath, projectDir) : null
        }
        else if (item.embed_url) {
            entry.embed_url = item.embed_url
        }
        else {
            continue
        }

        medias.push(entry)
    }

    const frontMatter = {
        uid: doc.uid,
        title: data.title || null,
        favorite: data.favorite ?? false,
        date: data.date || null,
        creative_work_type: data.creative_work_type || null,
        framework: data.framework || null,
        via: data.via || null,
        client: data.client || null,
        rate: data.rate ?? null,
        link: data.link?.url ?? null,
        link_label: data.link_label || null,
        tags: (data.tag_group ?? []).map(entry => entry.tag).filter(Boolean),
        awards: (data.awards ?? [])
            .filter(award => award.name || award.type || award.link?.url)
            .map(award => ({
                name: award.name || null,
                type: award.type || null,
                link: award.link?.url ?? null,
            })),
        medias,
        thumbnail: thumbnailPath ? toRelativePath(thumbnailPath, projectDir) : null,
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        meta_image: metaImagePath ? toRelativePath(metaImagePath, projectDir) : null,
        tools: data.tools ? data.tools.split(',').map(tool => tool.trim()).filter(Boolean) : [],
    }

    const shortDescription = richTextToMarkdown(data.short_description, warnings)
    const content = richTextToMarkdown(data.content, warnings)

    const fileContent = `---\n${dumpYaml(frontMatter, { lineWidth: -1 })}---\n\n## Short description\n\n${shortDescription}\n\n## Content\n\n${content}\n`

    writeFileSync(join(projectDir, 'project.md'), fileContent, 'utf-8')
}

console.log(`Fetching all "project" documents from "${REPOSITORY}"...`)

const documents = await client.getAllByType('project')

console.log(`${documents.length} project(s) found.`)

mkdirSync(OUTPUT_DIR, { recursive: true })

let warningsCount = 0

for (const doc of documents) {
    const warnings = []
    await buildProjectArchive(doc, warnings)

    for (const warning of warnings) {
        warningsCount++
        console.warn(`  [${doc.uid}] ${warning}`)
    }

    console.log(`  ${doc.uid} → projects-source/${doc.uid}/`)
}

console.log(`\nExport complete: ${OUTPUT_DIR} (${documents.length} project(s), ${warningsCount} warning(s))`)
