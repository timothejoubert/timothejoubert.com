import * as prismic from '@prismicio/client'
import { load as loadYaml } from 'js-yaml'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { markdownToRichText } from './lib/markdown-to-richtext.js'
import { hashBuffer, loadSyncState, saveSyncState } from './lib/sync-state.js'

const config = JSON.parse(readFileSync(join(process.cwd(), 'prismic.config.json'), 'utf-8'))
const REPOSITORY = config.repositoryName
const SOURCE_DIR = join(process.cwd(), 'projects-source')
const SYNC_STATE_PATH = join(SOURCE_DIR, '.sync-state.json')
const LANG = 'fr-fr'

const writeToken = process.env.PRISMIC_WRITE_TOKEN

if (!writeToken) {
    console.error('PRISMIC_WRITE_TOKEN is required (a permanent write token generated in the Prismic dashboard).')
    process.exit(1)
}

const args = process.argv.slice(2)
const shouldPublish = args.includes('--publish')
const requestedUids = args.filter(arg => !arg.startsWith('--'))

const projectCustomType = JSON.parse(
    readFileSync(join(process.cwd(), 'customtypes', 'project', 'index.json'), 'utf-8'),
).json.Main

const ALLOWED_CREATIVE_WORK_TYPES = new Set(projectCustomType.creative_work_type.config.options)
const ALLOWED_FRAMEWORKS = new Set(projectCustomType.framework.config.options)
const ALLOWED_TAGS = new Set(projectCustomType.tag_group.config.fields.tag.config.options)
const ALLOWED_AWARD_TYPES = new Set(projectCustomType.awards.config.fields.type.config.options)

const writeClient = prismic.createWriteClient(REPOSITORY, { writeToken })
const migration = prismic.createMigration()

function parseProjectMarkdown(raw) {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!match) throw new Error('Missing front-matter block.')

    const frontMatter = loadYaml(match[1]) ?? {}
    const sectionsMatch = match[2].match(/## Short description\s*\n+([\s\S]*?)\n+## Content\s*\n+([\s\S]*)$/)

    return {
        frontMatter,
        shortDescription: sectionsMatch?.[1]?.trim() ?? '',
        content: sectionsMatch?.[2]?.trim() ?? '',
    }
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

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
        if (media.sound_enabled !== undefined && typeof media.sound_enabled !== 'boolean') {
            errors.push(`Invalid sound_enabled "${media.sound_enabled}" (expected true or false)`)
        }
    }

    return errors
}

// Asset tags are capped at 20 characters by the Asset API — several project uids exceed
// that (e.g. "cest-tout-un-programme"), so the tag is a truncated prefix rather than the
// full uid. Truncated prefixes happen to stay distinct across the current project set.
function assetTag(uid) {
    return uid.slice(0, 20)
}

// Looks up the Prismic media library for an asset already tagged with this project's uid,
// matching on filename + exact byte size — the uid tag is what makes this safe (the same
// filename, e.g. "thumbnail.jpg", is reused across every project, so filename/size alone
// could false-match another project's asset of the same size). This is what actually
// prevents duplicate uploads across retries: a failed migrate() can leave assets created
// but undiscovered by .sync-state.json, since it's only persisted after a *successful*
// migration.
async function findExistingAssetId(uid, filename, size) {
    const url = new URL('assets', writeClient.assetAPIEndpoint)
    url.searchParams.set('keyword', filename)
    url.searchParams.set('pageSize', '100')

    const response = await fetch(url, {
        headers: { repository: writeClient.repositoryName, authorization: `Bearer ${writeClient.writeToken}` },
    })
    if (!response.ok) return null

    const { items } = await response.json()
    return items?.find(asset => asset.size === size && asset.tags?.some(tag => tag.name === assetTag(uid)))?.id ?? null
}

// dataPath describes where to read the resulting asset `id` back from a refetched
// document, once a *new* asset has actually been created by the migration.
async function resolveMedia(uid, projectDir, relPath, kind, dataPath, cachedMedia) {
    const buffer = readFileSync(join(projectDir, relPath))
    const hash = hashBuffer(buffer)
    const cached = cachedMedia?.[relPath]

    if (cached?.hash === hash) {
        return {
            relPath,
            hash,
            dataPath,
            changed: false,
            field: kind === 'image' ? { id: cached.assetId } : { link_type: 'Media', id: cached.assetId },
        }
    }

    const filename = relPath.split('/').pop()
    const existingId = await findExistingAssetId(uid, filename, buffer.length)
    if (existingId) {
        return {
            relPath,
            hash,
            dataPath,
            changed: false,
            field: kind === 'image' ? { id: existingId } : { link_type: 'Media', id: existingId },
        }
    }

    const asset = migration.createAsset(buffer, filename, { tags: [assetTag(uid)] })
    return { relPath, hash, dataPath, changed: true, field: kind === 'image' ? asset : { link_type: 'Media', id: asset } }
}

function readAssetIdFromDoc(doc, dataPath) {
    if (dataPath.type === 'thumbnail') return doc.data.thumbnail?.id ?? null
    if (dataPath.type === 'meta_image') return doc.data.meta_image?.id ?? null
    return doc.data.medias?.[dataPath.index]?.media?.id ?? null
}

function buildData({ uid, frontMatter, shortDescription, content, thumbnail, metaImage, mediaEntries }, projectDir) {
    const resolveImage = (src, alt) => {
        const buffer = readFileSync(join(projectDir, src))
        return migration.createAsset(buffer, src.split('/').pop(), { alt, tags: [assetTag(uid)] })
    }

    return {
        title: frontMatter.title ?? null,
        favorite: frontMatter.favorite ?? false,
        creative_work_type: frontMatter.creative_work_type ?? null,
        rate: frontMatter.rate ?? null,
        awards: (frontMatter.awards ?? []).map(award => ({
            name: award.name ?? null,
            type: award.type ?? null,
            link: award.link ? { link_type: 'Web', url: award.link } : { link_type: 'Any' },
        })),
        tag_group: (frontMatter.tags ?? []).map(tag => ({ tag })),
        framework: frontMatter.framework ?? null,
        via: frontMatter.via ?? null,
        client: frontMatter.client ?? null,
        tools: (frontMatter.tools ?? []).length > 0 ? frontMatter.tools.join(', ') : null,
        short_description: markdownToRichText(shortDescription).result,
        content: markdownToRichText(content, { resolveImage }).result,
        thumbnail: thumbnail?.field ?? null,
        date: frontMatter.date ?? null,
        link: frontMatter.link ? { link_type: 'Web', url: frontMatter.link } : { link_type: 'Any' },
        link_label: frontMatter.link_label ?? null,
        medias: (frontMatter.medias ?? []).map((media, index) => {
            const entry = { sound_enabled: media.sound_enabled ?? false }
            if (media.embed_url) entry.embed_url = media.embed_url
            else if (mediaEntries[index]) entry.media = mediaEntries[index].field
            return entry
        }),
        meta_title: frontMatter.meta_title ?? null,
        meta_description: frontMatter.meta_description ?? null,
        meta_image: metaImage?.field ?? {},
    }
}

const syncState = loadSyncState(SYNC_STATE_PATH)

const uids = readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(uid => requestedUids.length === 0 || requestedUids.includes(uid))

console.log(`Processing ${uids.length} project(s) from ${SOURCE_DIR}...`)

const pendingRefetch = []
const skipped = []
const errored = []
let confirmedCount = 0

for (const uid of uids) {
    const projectDir = join(SOURCE_DIR, uid)
    const markdownPath = join(projectDir, 'project.md')

    if (!existsSync(markdownPath)) continue

    const raw = readFileSync(markdownPath, 'utf-8')
    const sourceHash = hashBuffer(Buffer.from(raw))

    let parsed
    try {
        parsed = parseProjectMarkdown(raw)
    }
    catch (error) {
        errored.push({ uid, reason: error.message })
        continue
    }

    const { frontMatter, shortDescription, content } = parsed
    const validationErrors = validateFrontMatter(frontMatter)

    if (validationErrors.length > 0) {
        errored.push({ uid, reason: validationErrors.join('; ') })
        continue
    }

    const cached = syncState[uid]
    const mediaRelPaths = [
        frontMatter.thumbnail,
        frontMatter.meta_image,
        ...(frontMatter.medias ?? []).map(media => media.file).filter(Boolean),
    ].filter(Boolean)

    const unchanged
        = cached?.sourceHash === sourceHash
            && mediaRelPaths.every(relPath => cached.media?.[relPath]?.hash === hashBuffer(readFileSync(join(projectDir, relPath))))

    if (unchanged) {
        skipped.push(uid)
        continue
    }

    const thumbnail = frontMatter.thumbnail
        ? await resolveMedia(uid, projectDir, frontMatter.thumbnail, 'media', { type: 'thumbnail' }, cached?.media)
        : null
    const metaImage = frontMatter.meta_image
        ? await resolveMedia(uid, projectDir, frontMatter.meta_image, 'image', { type: 'meta_image' }, cached?.media)
        : null
    const mediaEntries = await Promise.all((frontMatter.medias ?? []).map((media, index) =>
        media.file ? resolveMedia(uid, projectDir, media.file, 'media', { type: 'medias', index }, cached?.media) : null,
    ))

    const data = buildData({ uid, frontMatter, shortDescription, content, thumbnail, metaImage, mediaEntries }, projectDir)
    const title = frontMatter.title || uid

    let existingDoc = null
    try {
        existingDoc = await writeClient.getByUID('project', uid)
    }
    catch (error) {
        if (!(error instanceof prismic.NotFoundError)) throw error
    }

    if (existingDoc) {
        migration.updateDocument({ ...existingDoc, data }, title)
        console.log(`  ${uid} → update queued`)
    }
    else {
        migration.createDocument({ type: 'project', uid, lang: LANG, data }, title)
        console.log(`  ${uid} → create queued`)
    }

    pendingRefetch.push({ uid, sourceHash, mediaEntries: [thumbnail, metaImage, ...mediaEntries].filter(Boolean) })
}

if (pendingRefetch.length > 0) {
    console.log(`\nMigrating ${pendingRefetch.length} project(s)...`)

    try {
        await writeClient.migrate(migration, { reporter: event => console.log(`  [migrate] ${event.type}`) })
    }
    catch (error) {
        console.warn(`\nmigrate() failed: ${error.message}`)
        if (error.response) console.warn(JSON.stringify(error.response, null, 2))
        else console.warn(error.stack)
        console.warn('Some projects below may or may not have been created/updated — verifying what actually landed in Prismic...')
    }

    // Re-fetch every processed project from Prismic rather than trusting local
    // assumptions — this is the only way to confirm a create/update actually
    // landed (migrate() can fail partway through) and to read back the real
    // asset ids for newly created media.
    console.log('\nVerifying migrated projects and resolving asset IDs...')
    for (const { uid, sourceHash, mediaEntries: entries } of pendingRefetch) {
        try {
            const doc = await writeClient.getByUID('project', uid)
            const media = {}

            for (const entry of entries) {
                const assetId = readAssetIdFromDoc(doc, entry.dataPath)
                if (!assetId) throw new Error(`Could not resolve asset id for "${entry.relPath}".`)
                media[entry.relPath] = { hash: entry.hash, assetId }
            }

            syncState[uid] = { sourceHash, media }
            confirmedCount++
        }
        catch (error) {
            errored.push({ uid, reason: `Could not confirm this project landed in Prismic correctly: ${error.message}. It will be retried on the next run.` })
        }

        // Persist progress after every project so a later failure can't discard earlier state.
        saveSyncState(SYNC_STATE_PATH, syncState)
    }

    if (shouldPublish) {
        console.log('\nPublishing migration release...')
        const result = await writeClient.publishMigrationRelease()
        console.log(`Published ${result.totalItems} item(s).`)
    }
}

saveSyncState(SYNC_STATE_PATH, syncState)

console.log(`\nDone. ${confirmedCount} migrated, ${skipped.length} unchanged, ${errored.length} error(s).`)

for (const { uid, reason } of errored) {
    console.warn(`  [${uid}] ${reason}`)
}
