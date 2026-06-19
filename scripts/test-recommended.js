#!/usr/bin/env node
/* eslint-disable import/order, security/detect-object-injection */

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
import strictFlatConfig from '../index.js'
import recommendedFlatConfig from '../exports/recommended.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
const sample = join(projectRoot, 'test/recommended/sample.ts')

async function countErrors(configFile) {
  const eslint = new ESLint({ overrideConfigFile: configFile })
  const results = await eslint.lintFiles([sample])
  return results.reduce((total, result) => total + result.errorCount, 0)
}

// Resolve a rule's effective severity across a flat-config array: later blocks
// win, so walk the whole array and keep the last block that sets the rule
// globally (no `files` scope). Returns the normalized severity string, or
// `undefined` if no global block configures it.
function effectiveSeverity(flatConfig, ruleId) {
  const severities = new Map([
    [0, 'off'],
    [1, 'warn'],
    [2, 'error'],
    ['off', 'off'],
    ['warn', 'warn'],
    ['error', 'error'],
  ])
  let resolved
  for (const block of flatConfig) {
    if (block === null || typeof block !== 'object') continue
    if (block.files !== undefined) continue
    const rules = block.rules
    if (rules === undefined || rules === null) continue
    const setting = rules[ruleId]
    if (setting === undefined) continue
    const level = Array.isArray(setting) ? setting[0] : setting
    resolved = severities.has(level) ? severities.get(level) : String(level)
  }
  return resolved
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
  console.log('✅ recommended preset relaxes the strict rules as expected.')

  // Regression guard: the recommended preset must relax `jsdoc/require-jsdoc`
  // (a documented migration-on-ramp rule) to `off`, while the strict default
  // config still enforces it. Asserted at the config level because the rule is
  // suppressed for everything under test/, so a fixture file cannot exercise it.
  const strictJsdoc = effectiveSeverity(strictFlatConfig, 'jsdoc/require-jsdoc')
  const relaxedJsdoc = effectiveSeverity(
    recommendedFlatConfig,
    'jsdoc/require-jsdoc'
  )

  console.log(`strict jsdoc/require-jsdoc:      ${strictJsdoc}`)
  console.log(`recommended jsdoc/require-jsdoc: ${relaxedJsdoc}`)

  if (strictJsdoc !== 'error') {
    console.error(
      `❌ Expected the strict config to enforce jsdoc/require-jsdoc (error); got "${strictJsdoc}".`
    )
    process.exit(1)
  }
  if (relaxedJsdoc !== 'off') {
    console.error(
      `❌ Expected the recommended preset to disable jsdoc/require-jsdoc (off); got "${relaxedJsdoc}".`
    )
    process.exit(1)
  }
  console.log('✅ recommended preset relaxes jsdoc/require-jsdoc as expected.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
