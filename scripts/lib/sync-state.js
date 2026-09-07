import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

export function hashBuffer(buffer) {
    return createHash('sha256').update(buffer).digest('hex')
}

export function loadSyncState(path) {
    if (!existsSync(path)) return {}
    return JSON.parse(readFileSync(path, 'utf-8'))
}

export function saveSyncState(path, state) {
    writeFileSync(path, JSON.stringify(state, null, 2), 'utf-8')
}
