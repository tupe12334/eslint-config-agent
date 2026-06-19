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
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
