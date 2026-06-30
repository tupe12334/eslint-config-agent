/**
 * Integration test for the `@typescript-eslint/no-non-null-assertion` rule
 * shipped by eslint-config-agent.
 *
 * The non-null assertion operator (`!`) silently tells the compiler "trust me,
 * this is never null or undefined" and is erased at compile time. A wrong
 * assumption does not fail at the assertion — it surfaces far away as a runtime
 * crash ("Cannot read properties of undefined"), often inside a consumer's
 * app. This is exactly what an AI assistant reaches for to silence a "possibly
 * undefined" TypeScript error without handling the case. The shared config must
 * flag every use of `!` while leaving proper null guards (`??`, `?.`, explicit
 * `if` checks) alone. This guards against accidental removal of the rule and
 * documents the intended behavior.
 *
 * The rule is syntactic (no type information required), but the TypeScript
 * project service requires real on-disk files, so the fixtures live in
 * `test/no-non-null-assertion/`. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const nonNullMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-non-null-assertion'
  )
}

console.log(
  'Testing @typescript-eslint/no-non-null-assertion rule from the shipped config...'
)

// Postfix `!` on a variable and in a property chain must both be flagged.
const invalid = await nonNullMessages(
  'test/no-non-null-assertion/invalid-no-non-null-assertion.ts'
)
assert.ok(
  invalid.length >= 2,
  `Expected at least two non-null assertions to be flagged, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-non-null-assertion should be an error'
)

// Nullish coalescing, optional chaining, and explicit if-guards must pass.
const valid = await nonNullMessages(
  'test/no-non-null-assertion/valid-no-non-null-assertion.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect any no-non-null-assertion violations in valid fixture, got ${valid.length}`
)

console.log('✅ All tests passed!')
