#!/usr/bin/env node

/**
 * Pack integrity guard.
 *
 * `test-exports.js` imports entry points via Node's self-referencing (the
 * package name resolves to local files), so it passes even when a file is
 * present in the source tree but excluded from the npm tarball.
 *
 * This script catches that class of bug by:
 *   1. Running `npm pack --ignore-scripts` to produce the real tarball.
 *   2. Installing that tarball in an isolated temp directory (no access to
 *      source files).
 *   3. Importing every documented entry point from the installed copy.
 *
 * Any `Cannot find module` or import error means the tarball is broken and
 * should NOT be published.
 *
 * This script was added after `rules/require-spec-file-tsx/helpers.js` was
 * present in the source tree but absent from the published 3.0.5 tarball,
 * causing a `Cannot find module` crash for all consumers.
 */

import { execSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, rmSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const pkg = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'))

const ENTRY_POINTS = Object.keys(pkg.exports ?? {}).filter(
  subpath => subpath !== './package.json' && subpath !== './to-warnings'
)

console.log('📦 Packing tarball…')
const packOutput = execSync('npm pack --ignore-scripts --json', {
  cwd: projectRoot,
  encoding: 'utf8',
})
const [{ filename }] = JSON.parse(packOutput)
const tarballPath = join(projectRoot, filename)

const tmpDir = mkdtempSync(join(tmpdir(), 'eslint-config-agent-verify-'))
console.log(`🔧 Installing packed tarball in ${tmpDir}`)

try {
  writeFileSync(
    join(tmpDir, 'package.json'),
    JSON.stringify({ name: 'verify-pack', version: '0.0.0', type: 'module' })
  )

  execSync(`npm install --no-package-lock --loglevel=error ${tarballPath}`, {
    cwd: tmpDir,
    stdio: 'inherit',
  })

  const failures = []

  for (const subpath of ENTRY_POINTS) {
    const specifier =
      subpath === '.' ? pkg.name : `${pkg.name}${subpath.slice(1)}`
    try {
      const result = execSync(
        `node --input-type=module --eval "import('${specifier}').then(m => { if (!Array.isArray(m.default)) throw new Error('default export is not a flat-config array'); process.stdout.write('OK\\n'); })"`,
        { cwd: tmpDir, encoding: 'utf8' }
      )
      if (result.trim() === 'OK') {
        console.log(`  ✅ ${specifier}`)
      } else {
        failures.push(`${specifier}: unexpected output — ${result.trim()}`)
      }
    } catch (error) {
      failures.push(`${specifier}: ${error.message.split('\n')[0]}`)
    }
  }

  if (failures.length > 0) {
    console.error('\n❌ Pack integrity check failed:')
    for (const failure of failures) {
      console.error(`   - ${failure}`)
    }
    process.exit(1)
  }

  console.log(
    `\n✅ All ${ENTRY_POINTS.length} entry point(s) load correctly from the packed tarball.`
  )
} finally {
  rmSync(tmpDir, { recursive: true, force: true })
  rmSync(tarballPath, { force: true })
}
