/**
 * Integration test for the `@typescript-eslint/strict-boolean-expressions`
 * rule shipped by eslint-config-agent.
 *
 * A *nullable* value in a boolean position (`if (maybeStr)`, `count && ...`,
 * `doubled ? ... : ...`) silently folds "present but empty/zero" together with
 * "missing" into the same falsy branch — a real edge case the author meant to
 * separate slips through. The shared config must flag those nullable
 * conditions while leaving explicit `!== undefined` / `!== null` / `!== 0`
 * checks alone. This guards against accidental removal of the rule and
 * documents the intended behavior.
 *
 * The rule is type-aware, so the fixtures must be real on-disk files the
 * TypeScript project service can resolve (a synthetic `lintText` filePath gets
 * no type information). Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const strictBooleanMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message =>
      message.ruleId === '@typescript-eslint/strict-boolean-expressions'
  )
}

console.log(
  'Testing strict-boolean-expressions rule from the shipped config...'
)

// Each nullable condition in the invalid fixture must be flagged.
const invalid = await strictBooleanMessages('test/strict-boolean/invalid.ts')
assert.ok(
  invalid.length >= 3,
  `Expected the three nullable conditions to be flagged by strict-boolean-expressions, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'strict-boolean-expressions should be an error'
)

// Explicit null/undefined/zero comparisons must all pass.
const valid = await strictBooleanMessages('test/strict-boolean/valid.ts')
assert.strictEqual(
  valid.length,
  0,
  'Did not expect explicit null/undefined/zero checks to be flagged'
)

console.log('✅ All tests passed!')
