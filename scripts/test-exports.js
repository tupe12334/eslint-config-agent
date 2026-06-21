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

// `./package.json` must be exposed and resolve to this package's manifest, so
// tooling can read it (e.g. `require.resolve('eslint-config-agent/package.json')`
// or a JSON import) without crashing on ERR_PACKAGE_PATH_NOT_EXPORTED. It is a
// data export, not a flat config, so it is verified here rather than in the
// flat-config loop.
async function verifyManifestExport(pkg, declared) {
  if (!declared.includes('./package.json')) {
    return [
      '"./package.json" is missing from package.json#exports; tooling cannot resolve the manifest.',
    ]
  }

  const specifier = `${pkg.name}/package.json`
  try {
    const mod = await import(specifier, { with: { type: 'json' } })
    const manifest = mod.default
    if (!manifest || manifest.name !== pkg.name) {
      return [
        `${specifier} resolved but did not yield this package's manifest (expected name "${pkg.name}").`,
      ]
    }
    console.log(`✅ ${specifier} → package manifest (name "${manifest.name}")`)
    return []
  } catch (error) {
    return [`${specifier} failed to load: ${error.message}`]
  }
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
  // a set avoids importing the same specifier twice. `./package.json` is a data
  // export (the manifest), not a flat config, so it is handled separately below
  // instead of being checked as a flat-config array.
  const subpaths = [...new Set([...EXPECTED_ENTRY_POINTS, ...declared])].filter(
    subpath => declared.includes(subpath) && subpath !== './package.json'
  )

  for (const subpath of subpaths) {
    const specifier = specifierFor(pkg.name, subpath)

    // `./package.json` is a manifest passthrough, not a flat-config entry
    // point. It exists so tooling can resolve the package manifest (e.g. to
    // read its version) without tripping ERR_PACKAGE_PATH_NOT_EXPORTED. Verify
    // it resolves to the manifest rather than checking it as a config array.
    if (subpath === './package.json') {
      try {
        const mod = await import(specifier, { with: { type: 'json' } })
        const manifest = mod.default
        if (!manifest || manifest.name !== pkg.name) {
          failures.push(
            `${specifier} resolved but did not yield the package manifest (name "${manifest && manifest.name}").`
          )
          continue
        }
        console.log(`✅ ${specifier} → package manifest (${manifest.name})`)
      } catch (error) {
        failures.push(`${specifier} failed to load: ${error.message}`)
      }
      continue
    }

    try {
      const mod = await import(specifier)
      const config = mod.default
      if (!Array.isArray(config)) {
        failures.push(
          `${specifier} resolved but its default export is not a flat-config array (got ${typeof config}).`
        )
        continue
      }
      if (config.length === 0) {
        failures.push(`${specifier} resolved to an empty flat-config array.`)
        continue
      }
      console.log(`✅ ${specifier} → ${config.length} flat-config block(s)`)
    } catch (error) {
      failures.push(`${specifier} failed to load: ${error.message}`)
    }
  }

  // (3) `./package.json` must resolve to this package's manifest.
  failures.push(...(await verifyManifestExport(pkg, declared)))

  if (failures.length > 0) {
    console.error('\n❌ Public exports surface check failed:')
    for (const failure of failures) {
      console.error(`   - ${failure}`)
    }
    process.exit(1)
  }

  console.log(
    `\n✅ All ${subpaths.length} entry point(s) resolve to usable flat configs, ` +
      `including every documented one (${EXPECTED_ENTRY_POINTS.join(', ')}).`
  )
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
