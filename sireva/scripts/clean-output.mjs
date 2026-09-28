import { existsSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const outputDir = resolve(process.cwd(), '.output')
const maxAttempts = 6

if (!existsSync(outputDir)) {
  process.exit(0)
}

for (let attempt = 1; attempt <= maxAttempts; attempt++) {
  try {
    rmSync(outputDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
    process.exit(0)
  } catch (error) {
    const lastAttempt = attempt === maxAttempts
    if (lastAttempt) {
      console.error('Failed to clean .output before build.')
      console.error(error)
      process.exit(1)
    }

    const backoffMs = attempt * 300
    // Brief blocking wait to allow file locks (OneDrive/AV/indexer) to release.
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, backoffMs)
  }
}
