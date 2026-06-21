/**
 * Integration test for the
 * `@typescript-eslint/no-unnecessary-boolean-literal-compare` rule shipped by
 * eslint-config-agent.
 *
 * Comparing a plain `boolean` against a boolean literal (`x === true`,
 * `x !== false`) is redundant: the value already carries the answer. The shared
 * config must flag those comparisons while leaving a direct boolean use and a
 * genuine narrowing of a nullable boolean (`maybeActive === true`) alone. This
 * guards against accidental removal of the rule and documents the intended
 * behavior.
 *
 * The rule is type-aware, so the fixtures must be real on-disk files the
 * TypeScript project service can resolve (a synthetic `lintText` filePath gets
 * no type information). Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const literalCompareMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message =>
      message.ruleId ===
      '@typescript-eslint/no-unnecessary-boolean-literal-compare'
  )
}

console.log(
  'Testing no-unnecessary-boolean-literal-compare rule from the shipped config...'
)

// Both literal comparisons on plain booleans must be flagged as errors.
const invalid = await literalCompareMessages(
  'test/no-unnecessary-boolean-literal-compare/invalid-literal-compare.ts'
)
assert.ok(
  invalid.length >= 2,
  `Expected both boolean-literal comparisons to be flagged, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-unnecessary-boolean-literal-compare should be an error'
)

// A direct boolean use and a nullable-boolean narrowing must both pass.
const valid = await literalCompareMessages(
  'test/no-unnecessary-boolean-literal-compare/valid-direct-and-nullable.ts'
)
assert.strictEqual(
  valid.length,
  0,
  'Did not expect a direct boolean use or a nullable narrowing to be flagged'
)

console.log('✅ All tests passed!')
