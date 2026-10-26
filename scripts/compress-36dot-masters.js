import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIR = join(process.cwd(), 'projects-source', 'm2-36-days-of-type', 'sources')

function formatSize(bytes) {
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} Go`
    if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} Mo`
    return `${(bytes / 1024).toFixed(1)} Ko`
}

const movFiles = readdirSync(DIR)
    .filter(name => name.toLowerCase().endsWith('.mov'))
    .filter(name => !/[-_]compress/i.test(name))
    .sort()

console.log(`${movFiles.length} .mov file(s) to compress in ${DIR}\n`)

let totalOriginal = 0
let totalCompressed = 0

for (const [index, name] of movFiles.entries()) {
    const srcPath = join(DIR, name)
    const outName = `${name.replace(/\.mov$/i, '')}.mp4`
    const outPath = join(DIR, outName)
    const tmpPath = `${outPath}.tmp.mp4`

    if (existsSync(outPath)) {
        console.log(`[${index + 1}/${movFiles.length}] Skipping "${name}" (already compressed)`)
        continue
    }

    if (existsSync(tmpPath)) rmSync(tmpPath)

    const originalSize = statSync(srcPath).size
    console.log(`[${index + 1}/${movFiles.length}] Compressing "${name}" (${formatSize(originalSize)})...`)

    const start = Date.now()
    try {
        execFileSync('ffmpeg', [
            '-y',
            '-i', srcPath,
            '-c:v', 'libx265',
            '-crf', '26',
            '-preset', 'medium',
            '-tag:v', 'hvc1',
            '-c:a', 'aac',
            '-b:a', '128k',
            tmpPath,
        ], { stdio: ['ignore', 'ignore', 'ignore'] })
    }
    catch (error) {
        console.error(`  Failed: ${error.message}`)
        if (existsSync(tmpPath)) rmSync(tmpPath)
        continue
    }

    renameSync(tmpPath, outPath)

    const compressedSize = statSync(outPath).size
    const elapsed = ((Date.now() - start) / 1000).toFixed(0)
    totalOriginal += originalSize
    totalCompressed += compressedSize

    const ratio = (100 * (1 - compressedSize / originalSize)).toFixed(0)
    console.log(`  Done in ${elapsed}s: ${formatSize(originalSize)} -> ${formatSize(compressedSize)} (-${ratio}%)\n`)
}

console.log('Summary:')
console.log(`  Total original (processed this run): ${formatSize(totalOriginal)}`)
console.log(`  Total compressed (processed this run): ${formatSize(totalCompressed)}`)
if (totalOriginal > 0) {
    console.log(`  Overall reduction this run: -${(100 * (1 - totalCompressed / totalOriginal)).toFixed(0)}%`)
}
console.log('\nOriginal .mov files were kept untouched — delete them manually once you\'ve validated the .mp4 versions.')
