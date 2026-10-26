import { createHash } from 'node:crypto'
import { createReadStream, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const SOURCE_DIR = join(process.cwd(), 'projects-source')
const REPORT_PATH = join(SOURCE_DIR, '.duplicates-report.md')
const MIN_SIZE = 1024

function walk(dir, files = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === '.git' || entry.name === '.DS_Store') continue
        const fullPath = join(dir, entry.name)
        if (entry.isDirectory()) walk(fullPath, files)
        else if (entry.isFile()) files.push(fullPath)
    }
    return files
}

function hashFile(path) {
    return new Promise((resolve, reject) => {
        const hash = createHash('sha1')
        const stream = createReadStream(path)
        stream.on('data', chunk => hash.update(chunk))
        stream.on('end', () => resolve(hash.digest('hex')))
        stream.on('error', reject)
    })
}

function formatSize(bytes) {
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} Go`
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} Mo`
    return `${(bytes / 1024).toFixed(1)} Ko`
}

console.log(`Scanning ${SOURCE_DIR}...`)
const allFiles = walk(SOURCE_DIR)
console.log(`Found ${allFiles.length} files.`)

const bySize = new Map()
for (const path of allFiles) {
    const size = statSync(path).size
    if (size < MIN_SIZE) continue
    if (!bySize.has(size)) bySize.set(size, [])
    bySize.get(size).push(path)
}

const candidates = [...bySize.values()].filter(group => group.length > 1)
const candidateCount = candidates.reduce((sum, group) => sum + group.length, 0)
console.log(`Hashing ${candidateCount} files sharing a size with at least one other file...`)

const byHash = new Map()
for (const group of candidates) {
    for (const path of group) {
        const size = statSync(path).size
        const hash = await hashFile(path)
        const key = `${size}:${hash}`
        if (!byHash.has(key)) byHash.set(key, { size, paths: [] })
        byHash.get(key).paths.push(path)
    }
}

const duplicateGroups = [...byHash.values()]
    .filter(group => group.paths.length > 1)
    .map(group => ({ ...group, recoverable: group.size * (group.paths.length - 1) }))
    .sort((a, b) => b.recoverable - a.recoverable)

const totalRecoverable = duplicateGroups.reduce((sum, group) => sum + group.recoverable, 0)

const lines = []
lines.push('# Rapport de doublons — projects-source/')
lines.push('')
lines.push(`Généré le ${new Date().toISOString()}.`)
lines.push('')
lines.push(`- ${duplicateGroups.length} groupe(s) de fichiers strictement identiques (même hash de contenu)`)
lines.push(`- ${formatSize(totalRecoverable)} récupérable(s) en ne gardant qu'un exemplaire par groupe`)
lines.push('')
lines.push('Ce rapport est en lecture seule : rien n\'a été supprimé. Pour chaque groupe, choisis quel(s) chemin(s) supprimer.')
lines.push('')

for (const [index, group] of duplicateGroups.entries()) {
    lines.push(`## Groupe ${index + 1} — ${group.paths.length} copies × ${formatSize(group.size)} (${formatSize(group.recoverable)} récupérable)`)
    lines.push('')
    for (const path of group.paths) {
        lines.push(`- \`${relative(process.cwd(), path)}\``)
    }
    lines.push('')
}

writeFileSync(REPORT_PATH, lines.join('\n'))
console.log(`\nDone. ${duplicateGroups.length} duplicate group(s), ${formatSize(totalRecoverable)} recoverable.`)
console.log(`Report written to ${relative(process.cwd(), REPORT_PATH)}`)
