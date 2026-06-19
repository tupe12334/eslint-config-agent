#!/usr/bin/env node
/* eslint-disable import/order */

/**
 * Smoke test for the `eslint-config-agent/recommended` preset.
 *
 * Asserts that the relaxed preset accepts idiomatic TypeScript (optional
 * chaining, nullish coalescing, default params, generic Error, multiple
 * exports, no spec file) that the strict default config rejects — proving the
 * preset actually relaxes the opinionated rules.
 */

import { ESLint } from 'eslint'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
const sample = join(projectRoot, 'test/recommended/sample.ts')

async function countErrors(configFile) {
  const eslint = new ESLint({ overrideConfigFile: configFile })
  const results = await eslint.lintFiles([sample])
  return results.reduce((total, result) => total + result.errorCount, 0)
}

// Resolve the severity ESLint would apply to `rule` for a plain source file
// (one the strict config's length-limit override layer actually targets — i.e.
// not under test/, not a config file). Returns the numeric severity: 2 = error,
// 1 = warn, 0 = off.
async function severityFor(configFile, rule) {
  const eslint = new ESLint({ overrideConfigFile: configFile })
  const resolved = await eslint.calculateConfigForFile(
    join(projectRoot, 'src/length-probe.ts')
  )
  const match = Object.entries(resolved.rules).find(([name]) => name === rule)
  if (match === undefined) {
    return 0
  }
  const entry = match[1]
  return Array.isArray(entry) ? entry[0] : entry
}

const LENGTH_RULES = ['max-lines-per-function', 'max-lines']

// Assert a resolved severity matches the expectation, exiting on mismatch.
// Pulling this out of the loop keeps the loop body flat (a guard-clause early
// return here instead of an `if` that wraps the failure branch).
function expectSeverity(rule, actual, expected, description) {
  if (actual === expected) {
    return
  }
  console.error(`❌ Expected the ${description} for ${rule}.`)
  process.exit(1)
}

async function main() {
  const strictErrors = await countErrors(join(projectRoot, 'eslint.config.js'))
  const relaxedErrors = await countErrors(
    join(projectRoot, 'test/recommended/eslint.config.js')
  )

  console.log(`strict config errors:      ${strictErrors}`)
  console.log(`recommended preset errors: ${relaxedErrors}`)

  if (strictErrors === 0) {
    console.error(
      '❌ Expected the strict config to flag the sample; the fixture no longer exercises the relaxed rules.'
    )
    process.exit(1)
  }
  if (relaxedErrors !== 0) {
    console.error(
      '❌ Expected the recommended preset to accept the sample with zero errors.'
    )
    process.exit(1)
  }

  // The length limits (`max-lines`, `max-lines-per-function`) are hard errors
  // in the strict default but must be downgraded to warnings in the recommended
  // preset, so they cannot fail a CI lint run during incremental adoption.
  const strictConfig = join(projectRoot, 'eslint.config.js')
  const recommendedConfig = join(
    projectRoot,
    'test/recommended/eslint.config.js'
  )
  for (const rule of LENGTH_RULES) {
    const strictSeverity = await severityFor(strictConfig, rule)
    const relaxedSeverity = await severityFor(recommendedConfig, rule)
    console.log(
      `${rule}: strict=${strictSeverity} recommended=${relaxedSeverity}`
    )
    expectSeverity(
      rule,
      strictSeverity,
      2,
      'strict config to enforce it as an error (2)'
    )
    expectSeverity(
      rule,
      relaxedSeverity,
      1,
      'recommended preset to downgrade it to a warning (1)'
    )
  }

  console.log('✅ recommended preset relaxes the strict rules as expected.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
