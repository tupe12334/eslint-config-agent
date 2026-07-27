/**
 * Integration test for the `@typescript-eslint/no-redeclare` rule shipped by
 * eslint-config-agent.
 *
 * A redeclared function/variable/class silently overrides the earlier binding
 * in the same scope, so the first definition becomes unreachable dead code and
 * a reader has no way to tell which declaration actually runs without checking
 * order. The core `no-redeclare` rule is turned off for TypeScript files (it
 * false-positives on TS-specific merging patterns like a class/interface pair),
 * so the shared config must cover TS files with the type-aware variant instead
 * — the same replacement pattern already used for `@typescript-eslint/no-shadow`
 * vs core `no-shadow`. This guards against accidental removal of the rule and
 * documents the intended behavior.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noRedeclareMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-redeclare'
  )
}

console.log('Testing no-redeclare rule from the shipped config...')

// Two top-level function declarations sharing the same name must be flagged.
const invalid = await noRedeclareMessages(
  'test/no-redeclare/invalid-no-redeclare.ts'
)
assert.ok(
  invalid.length > 0,
  `Expected the redeclared function to be flagged by no-redeclare, got ${invalid.length}`
)
assert.strictEqual(invalid[0].severity, 2, 'no-redeclare should be an error')

// Two function declarations with distinct names must pass.
const valid = await noRedeclareMessages(
  'test/no-redeclare/valid-no-redeclare.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect distinctly named function declarations to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
