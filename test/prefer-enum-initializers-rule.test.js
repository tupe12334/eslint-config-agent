/**
 * Integration test for the `@typescript-eslint/prefer-enum-initializers` rule
 * shipped by eslint-config-agent.
 *
 * Without an explicit initializer TypeScript assigns implicit numeric values
 * (0, 1, 2, …) based on member position, so reordering or inserting a new
 * member silently changes every subsequent value — a breaking API change the
 * type-checker cannot catch. The shared config must flag every member that
 * lacks an explicit initializer and leave members with explicit values alone.
 * This guards against accidental removal of the rule and documents the
 * intended behavior.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const enumInitializerMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/prefer-enum-initializers'
  )
}

console.log('Testing prefer-enum-initializers rule from the shipped config...')

// Every member without an explicit initializer must be flagged.
const invalid = await enumInitializerMessages(
  'test/prefer-enum-initializers/invalid-implicit-enum.ts'
)
assert.ok(
  invalid.length > 0,
  `Expected members without initializers to be flagged by prefer-enum-initializers, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'prefer-enum-initializers should be an error'
)

// Members with explicit string initializers must not be flagged.
const valid = await enumInitializerMessages(
  'test/prefer-enum-initializers/valid-explicit-enum.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect members with explicit initializers to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
