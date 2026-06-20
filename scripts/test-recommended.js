#!/usr/bin/env node
/* eslint-disable import/order */

/**
 * Smoke test for the `eslint-config-agent/recommended` preset.
 *
 * Asserts that the relaxed preset accepts idiomatic TypeScript (optional
 * chaining, nullish coalescing, default params, generic Error, multiple
 * exports, no spec file) and idiomatic JSX (a Tailwind-only `className`) that
 * the strict default config rejects — proving the preset actually relaxes the
 * opinionated rules.
 */

import { ESLint } from 'eslint'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
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

async function main() {
  const checks = []
  for (const sample of samples) {
    checks.push({
      sample,
      strictErrors: await countErrors(strictConfig, sample),
      relaxedErrors: await countErrors(recommendedConfig, sample),
    })
  }

  for (const check of checks) {
    console.log(`\n${check.sample}`)
    console.log(`  strict config errors:      ${check.strictErrors}`)
    console.log(`  recommended preset errors: ${check.relaxedErrors}`)
  }

  const unflagged = checks.find(check => check.strictErrors === 0)
  if (unflagged) {
    console.error(
      `❌ Expected the strict config to flag ${unflagged.sample}; the fixture no longer exercises the relaxed rules.`
    )
    process.exit(1)
  }

  const leaked = checks.find(check => check.relaxedErrors !== 0)
  if (leaked) {
    console.error(
      `❌ Expected the recommended preset to accept ${leaked.sample} with zero errors.`
    )
    process.exit(1)
  }

  console.log('\n✅ recommended preset relaxes the strict rules as expected.')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
