#!/usr/bin/env node

/**
 * Public `exports` surface guard.
 *
 * The package advertises three entry points in its `package.json#exports`
 * map — `.`, `./ddd` and `./recommended` — and the README tells consumers to
 * import them by exactly those specifiers:
 *
 *   import config       from 'eslint-config-agent'
 *   import dddConfig    from 'eslint-config-agent/ddd'
 *   import recommended  from 'eslint-config-agent/recommended'
 *
 * If a subpath is documented/shipped but missing from the `exports` map, the
 * import does not warn — it hard-crashes the consumer's ESLint run with
 * `ERR_PACKAGE_PATH_NOT_EXPORTED` before a single file is linted. A published
 * release once shipped `exports/recommended.js` and documented it in the
 * README while omitting `./recommended` from the `exports` map, so every
 * consumer following the README crashed.
 *
 * This test asserts two things, so the `exports` map can drift in neither
 * direction:
 *
 *   1. Every entry point the README promises (`EXPECTED_ENTRY_POINTS`) is
 *      present in the `exports` map and resolves *through the package name*
 *      (self-reference), exactly the way a consumer imports it. Dropping a
 *      documented subpath from the map — the 3.0.4 regression — fails here.
 *   2. Every subpath actually declared in the `exports` map resolves to a
 *      non-empty flat-config array. Wiring a subpath to a missing or malformed
 *      file fails here.
 */

import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

// The public entry points the README documents. Keep in sync with the README
// usage section and `package.json#exports`.
const EXPECTED_ENTRY_POINTS = [
  '.',
  './ddd',
  './recommended',
  './recommended-incremental',
  './incremental',
  './to-warnings',
]

async function readPackageJson() {
  const raw = await readFile(join(projectRoot, 'package.json'), 'utf8')
  return JSON.parse(raw)
}

function specifierFor(packageName, subpath) {
  if (subpath === '.') {
    return packageName
  }
  return `${packageName}${subpath.slice(1)}`
}

// `./package.json` is a manifest passthrough, not a flat-config entry point. It
// exists so tooling can resolve the package manifest (e.g. to read its version)
// without tripping ERR_PACKAGE_PATH_NOT_EXPORTED. Verify it resolves to the
// manifest rather than checking it as a config array.
async function verifyManifest(specifier, packageName) {
  const { default: manifest } = await import(specifier, { with: { type: 'json' } }) // prettier-ignore
  if (!manifest || manifest.name !== packageName) {
    return `${specifier} resolved but did not yield the package manifest (name "${manifest && manifest.name}").`
  }
  console.log(`✅ ${specifier} → package manifest (${manifest.name})`)
}

// `./to-warnings` is a named-function helper, not a default flat-config entry
// point. It exposes the severity-downgrade helper the incremental presets use
// internally so consumers composing their own config can map it over the shared
// ruleset instead of copy-pasting it. Verify the named export is a function and
// behaves (downgrades an error-level rule to a warning) rather than checking it
// as a config array.
async function verifyToWarnings(specifier) {
  const { toWarnings } = await import(specifier)
  if (typeof toWarnings !== 'function') {
    return `${specifier} resolved but did not export a \`toWarnings\` function (got ${typeof toWarnings}).`
  }
  const downgraded = toWarnings({ rules: { eqeqeq: 'error' } })
  if (downgraded.rules.eqeqeq !== 'warn') {
    return `${specifier} exported \`toWarnings\` but it did not downgrade an error-level rule to a warning (got ${JSON.stringify(downgraded.rules.eqeqeq)}).`
  }
  console.log(`✅ ${specifier} → toWarnings() helper`)
}

async function verifyConfigArray(specifier) {
  const { default: config } = await import(specifier)
  if (!Array.isArray(config)) {
    return `${specifier} resolved but its default export is not a flat-config array (got ${typeof config}).`
  }
  if (config.length === 0) {
    return `${specifier} resolved to an empty flat-config array.`
  }
  console.log(`✅ ${specifier} → ${config.length} flat-config block(s)`)
}

// `./package.json` and `./to-warnings` are not flat-config arrays, so they get
// bespoke checks; every other subpath is verified as a flat-config array.
function verifierFor(subpath) {
  if (subpath === './package.json') return verifyManifest
  if (subpath === './to-warnings') return verifyToWarnings
  return verifyConfigArray
}

async function main() {
  const pkg = await readPackageJson()
  const declared = Object.keys(pkg.exports || {})

  if (declared.length === 0) {
    console.error('❌ package.json defines no `exports` map to verify.')
    process.exit(1)
  }

  const failures = []

  // (1) Every documented entry point must be declared in the `exports` map.
  for (const expected of EXPECTED_ENTRY_POINTS) {
    if (!declared.includes(expected)) {
      failures.push(
        `documented entry point "${expected}" is missing from package.json#exports.`
      )
    }
  }

  // (2) Verify every documented entry point plus every declared subpath. Using
  // a set avoids importing the same specifier twice.
  const subpaths = [...new Set([...EXPECTED_ENTRY_POINTS, ...declared])].filter(
    subpath => declared.includes(subpath)
  )

  for (const subpath of subpaths) {
    const specifier = specifierFor(pkg.name, subpath)
    try {
      const failure = await verifierFor(subpath)(specifier, pkg.name)
      if (failure) {
        failures.push(failure)
      }
    } catch (error) {
      failures.push(`${specifier} failed to load: ${error.message}`)
    }
  }

  if (failures.length > 0) {
    console.error('\n❌ Public exports surface check failed:')
    for (const failure of failures) {
      console.error(`   - ${failure}`)
    }
    process.exit(1)
  }

  const documented = EXPECTED_ENTRY_POINTS.join(', ')
  console.log(`\n✅ All ${subpaths.length} entry point(s) resolve, including every documented one (${documented}).`) // prettier-ignore
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
