/**
 * Integration test for the `@typescript-eslint/no-floating-promises` rule
 * shipped by eslint-config-agent.
 *
 * A Promise created but never awaited, returned, void-ed, or handled with
 * .catch/.then must be flagged. A Promise that is awaited, returned,
 * explicitly void-ed, or .catch-handled must not be flagged.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noFloatingPromisesMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-floating-promises'
  )
}

console.log('Testing no-floating-promises rule from the shipped config...')

// A promise called but never awaited/returned/void-ed/caught must be flagged.
const invalid = await noFloatingPromisesMessages(
  'test/no-floating-promises/invalid-floating-promise.ts'
)
assert.ok(
  invalid.length > 0,
  `Expected a floating promise to be flagged, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-floating-promises should be an error'
)

// Awaited, returned, void-ed, and .catch-handled promises must not be flagged.
const valid = await noFloatingPromisesMessages(
  'test/no-floating-promises/valid-floating-promise.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a properly handled promise to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
