import { load as loadYaml } from 'js-yaml'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const SOURCE_DIR = join(process.cwd(), 'projects-source')

const projectCustomTypeJson = JSON.parse(
    readFileSync(join(process.cwd(), 'customtypes', 'project', 'index.json'), 'utf-8'),
).json
const projectCustomType = { ...projectCustomTypeJson.Main, ...projectCustomTypeJson.Details }

const ALLOWED_CREATIVE_WORK_TYPES = new Set(projectCustomType.creative_work_type.config.options)
const ALLOWED_FRAMEWORKS = new Set(projectCustomType.framework.config.options)
const ALLOWED_TAGS = new Set(projectCustomType.tag_group.config.fields.tag.config.options)
const ALLOWED_AWARD_TYPES = new Set(projectCustomType.awards.config.fields.type.config.options)

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const ALLOWED_LINK_STATUSES = new Set(['online', 'offline', 'archived'])

function parseProjectMarkdown(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!match) throw new Error('Missing front-matter block.')
    return loadYaml(match[1]) ?? {}
}

function validateFrontMatter(frontMatter) {
    const errors = []

    if (frontMatter.creative_work_type && !ALLOWED_CREATIVE_WORK_TYPES.has(frontMatter.creative_work_type)) {
        errors.push(`Invalid creative_work_type "${frontMatter.creative_work_type}"`)
    }
    if (frontMatter.framework && !ALLOWED_FRAMEWORKS.has(frontMatter.framework)) {
        errors.push(`Invalid framework "${frontMatter.framework}"`)
    }
    for (const tag of frontMatter.tags ?? []) {
        if (!ALLOWED_TAGS.has(tag)) errors.push(`Invalid tag "${tag}"`)
    }
    for (const award of frontMatter.awards ?? []) {
        if (award.type && !ALLOWED_AWARD_TYPES.has(award.type)) errors.push(`Invalid award type "${award.type}"`)
    }
    if (frontMatter.date !== null && frontMatter.date !== undefined && !DATE_PATTERN.test(frontMatter.date)) {
        errors.push(`Invalid date "${frontMatter.date}" (expected YYYY-MM-DD)`)
    }
    if (frontMatter.favorite !== undefined && typeof frontMatter.favorite !== 'boolean') {
        errors.push(`Invalid favorite "${frontMatter.favorite}" (expected true or false)`)
    }
    for (const media of frontMatter.medias ?? []) {
        if (media.file && media.embed_url) errors.push(`Media entry has both "file" and "embed_url": ${media.file}`)
        if (!media.file && !media.embed_url) errors.push('Media entry has neither "file" nor "embed_url"')
        if (media.sound_enabled !== undefined && typeof media.sound_enabled !== 'boolean') {
            errors.push(`Invalid sound_enabled "${media.sound_enabled}" (expected true or false)`)
        }
    }
    for (const source of frontMatter.sources ?? []) {
        if (!source.label) errors.push(`Source entry missing "label": ${source.link ?? '?'}`)
        if (!source.link) errors.push(`Source entry missing "link": ${source.label ?? '?'}`)
    }
    if (frontMatter.link_status && !ALLOWED_LINK_STATUSES.has(frontMatter.link_status)) {
        errors.push(`Invalid link_status "${frontMatter.link_status}" (expected online, offline or archived)`)
    }
    for (const collaborator of frontMatter.collaborators ?? []) {
        if (!collaborator.name) errors.push(`Collaborator entry missing "name": ${collaborator.role ?? '?'}`)
        if (!collaborator.role) errors.push(`Collaborator entry missing "role": ${collaborator.name ?? '?'}`)
    }
    for (const tool of frontMatter.tools ?? []) {
        if (typeof tool !== 'string' || !tool.trim()) errors.push(`Invalid tools entry "${tool}" (expected a non-empty string)`)
    }
    if (frontMatter.client !== undefined && frontMatter.client !== null && typeof frontMatter.client !== 'string') {
        errors.push(`Invalid client "${frontMatter.client}" (expected a string)`)
    }
    if (frontMatter.via !== undefined && frontMatter.via !== null && typeof frontMatter.via !== 'string') {
        errors.push(`Invalid via "${frontMatter.via}" (expected a string)`)
    }

    return errors
}

function checkMediaFiles(projectDir, frontMatter) {
    const errors = []
    const referenced = new Set()

    const checkPath = (relPath, label) => {
        if (!relPath) return
        referenced.add(relPath)
        if (!existsSync(join(projectDir, relPath))) errors.push(`Missing file for ${label}: "${relPath}"`)
    }

    checkPath(frontMatter.thumbnail, 'thumbnail')
    checkPath(frontMatter.meta_image, 'meta_image')
    for (const [index, media] of (frontMatter.medias ?? []).entries()) {
        if (media.file) checkPath(media.file, `medias[${index}]`)
    }

    const mediaDir = join(projectDir, 'media')
    if (existsSync(mediaDir)) {
        for (const file of readdirSync(mediaDir)) {
            if (file.startsWith('.')) continue
            const relPath = `media/${file}`
            if (!referenced.has(relPath)) errors.push(`Orphan file in media/ not referenced by any field: "${relPath}"`)
        }
    }

    return errors
}

const uids = readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()

console.log(`Checking ${uids.length} project(s) in ${SOURCE_DIR}...`)

let errorCount = 0
let skippedCount = 0

for (const uid of uids) {
    const projectDir = join(SOURCE_DIR, uid)
    const markdownPath = join(projectDir, 'project.md')

    if (!existsSync(markdownPath)) {
        console.log(`  [${uid}] Skipped (no project.md yet)`)
        skippedCount++
        continue
    }

    const raw = readFileSync(markdownPath, 'utf-8')

    let frontMatter
    try {
        frontMatter = parseProjectMarkdown(raw)
    }
    catch (error) {
        console.warn(`  [${uid}] ${error.message}`)
        errorCount++
        continue
    }

    if (frontMatter.uid && frontMatter.uid !== uid) {
        console.warn(`  [${uid}] Front-matter uid "${frontMatter.uid}" does not match folder name`)
        errorCount++
    }

    const errors = [...validateFrontMatter(frontMatter), ...checkMediaFiles(projectDir, frontMatter)]

    if (errors.length > 0) {
        console.warn(`  [${uid}]`)
        for (const error of errors) console.warn(`    - ${error}`)
        errorCount += errors.length
    }
}

const skippedSummary = skippedCount > 0 ? ` (${skippedCount} skipped, no project.md yet)` : ''
console.log(`\nDone. ${errorCount === 0 ? 'No issues found.' : `${errorCount} issue(s) found.`}${skippedSummary}`)

if (errorCount > 0) process.exit(1)
