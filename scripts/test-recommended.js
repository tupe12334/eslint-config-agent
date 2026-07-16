#!/usr/bin/env node
/* eslint-disable import/order */

/**
 * Smoke test for the `eslint-config-agent/recommended` preset.
 *
 * Asserts that the relaxed preset accepts idiomatic TypeScript (optional
 * chaining, nullish coalescing, default params, generic Error, multiple
 * exports, no spec file) and idiomatic JSX (a Tailwind-only `className`) that
 * the strict default config rejects — proving the preset actually relaxes the
 * opinionated rules. Also asserts that `max-lines-per-function`/`max-lines`
 * stay enforced at the same 70/100-line thresholds as the strict default, but
 * downgraded from `error` to `warn` (issue #85), so an adopting codebase's
 * legacy long functions/files surface as backlog instead of failing CI.
 */

import { ESLint } from 'eslint'
import { join } from 'node:path'
import { assertRuleChecks } from './lib/assert-rule-checks.js'

const __filename = import.meta.filename
const __dirname = import.meta.dirname
const projectRoot = join(__dirname, '..')
// Lint against the shipped config (`index.js`) rather than this repo's local
// `eslint.config.js`, which deliberately ignores the invalid-by-design
// `sample.jsx` fixture so the repo's own lint stays green.
const strictConfig = join(projectRoot, 'index.js')
const recommendedConfig = join(projectRoot, 'test/recommended/eslint.config.js')

// Each fixture is idiomatic code the strict default rejects but the relaxed
// preset must accept. `sample.ts` covers the TypeScript relaxations; the
// `sample.jsx` covers `jsx-classname/require-classname` (a Tailwind-only
// className), which would otherwise block every React/Preact + Tailwind repo.
const samples = [
  join(projectRoot, 'test/recommended/sample.ts'),
  join(projectRoot, 'test/recommended/sample.jsx'),
]

async function countErrors(configFile, sample) {
  const eslint = new ESLint({ overrideConfigFile: configFile })
  const results = await eslint.lintFiles([sample])
  return results.reduce((total, result) => total + result.errorCount, 0)
}

async function checkSample(sample) {
  const strictErrors = await countErrors(strictConfig, sample)
  const relaxedErrors = await countErrors(recommendedConfig, sample)
  console.log(`\n${sample}`)
  console.log(`  strict config errors:      ${strictErrors}`)
  console.log(`  recommended preset errors: ${relaxedErrors}`)
  if (strictErrors === 0) {
    console.error(
      `❌ Expected the strict config to flag ${sample}; the fixture no longer exercises the relaxed rules.`
    )
    process.exit(1)
  }
  if (relaxedErrors === 0) {
    return
  }
  console.error(
    `❌ Expected the recommended preset to accept ${sample} with zero errors.`
  )
  process.exit(1)
}

async function main() {
  await Promise.all(samples.map(sample => checkSample(sample)))

  await assertRuleChecks(projectRoot, strictConfig, recommendedConfig)

  console.log('\n✅ recommended preset relaxes the strict rules as expected.')
}

try {
  await main()
} catch (error) {
  console.error(error)
  process.exit(1)
}
