/**
 * fix-signature.js
 * Re-signs the main app binary and all Electron frameworks/helpers ad-hoc
 * to fix macOS 26+ Team ID validation mismatch.
 *
 * Usage: node scripts/fix-signature.js
 * (No auto-launch — use npm run electron:build:sign to build+sign+launch in one go)
 */
import path from 'path'
import { execSync } from 'child_process'
import { spawn } from 'child_process'
import fs from 'fs'

const APP_NAME = '汪星日记'
const RELEASE_DIR = path.join(process.cwd(), 'release', 'mac-arm64', APP_NAME + '.app')
const MAIN_BIN = path.join(RELEASE_DIR, 'Contents', 'MacOS', APP_NAME)
const FW_DIR = path.join(RELEASE_DIR, 'Contents', 'Frameworks')

if (!fs.existsSync(RELEASE_DIR)) {
  console.error(`App not found at: ${RELEASE_DIR}`)
  process.exit(1)
}

function signAdHoc(file) {
  if (!fs.existsSync(file)) return
  try {
    execSync(`codesign --force --sign - "${file}"`, { stdio: 'pipe' })
    console.log(`  ✓ ${path.basename(file)}`)
  } catch {
    console.log(`  ✗ ${path.basename(file)}`)
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name.endsWith('.framework')) {
        signAdHoc(full)
        walkDir(path.join(full, 'Versions', 'A'))
      } else if (entry.name.endsWith('.app')) {
        walkDir(path.join(full, 'Contents', 'MacOS'))
        signAdHoc(full)
      } else if (entry.name === 'MacOS' || entry.name === 'Libraries') {
        walkDir(full)
      }
    } else if (entry.isFile()) {
      const stat = fs.statSync(full)
      if ((stat.mode & 0o111) !== 0 || entry.name.endsWith('.dylib')) {
        signAdHoc(full)
      }
    }
  }
}

console.log(`Signing main binary: ${APP_NAME}`)
signAdHoc(MAIN_BIN)
console.log(`\nSigning frameworks...`)
walkDir(FW_DIR)
console.log(`\nAll signatures applied.`)
console.log(`Launch with: open "${RELEASE_DIR}"`)
