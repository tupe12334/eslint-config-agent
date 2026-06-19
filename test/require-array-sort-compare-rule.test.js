/**
 * Integration test for the `@typescript-eslint/require-array-sort-compare`
 * rule shipped by eslint-config-agent.
 *
 * `Array.prototype.sort` coerces every element to a string and compares
 * UTF-16 code units, so `[10, 2, 1].sort()` returns `[1, 10, 2]` — a
 * silent wrong-order bug the type checker cannot catch and one AI assistants
 * emit when they reach for `.sort()` on a numeric array. The shared config must
 * flag a comparator-less sort on a non-string array while leaving an explicit
 * comparator (and a plain `string[]` sort, via `ignoreStringArrays: true`)
 * alone. This guards against accidental removal of the rule and documents the
 * intended behavior.
 *
 * The rule is type-aware, so the fixtures must be real on-disk files the
 * TypeScript project service can resolve (a synthetic `lintText` filePath gets
 * no type information). Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const sortCompareMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message =>
      message.ruleId === '@typescript-eslint/require-array-sort-compare'
  )
}

console.log(
  'Testing require-array-sort-compare rule from the shipped config...'
)

// Both comparator-less `.sort()` calls on a number array must be flagged.
const invalid = await sortCompareMessages(
  'test/sort-compare/invalid-number-sort.ts'
)
assert.ok(
  invalid.length >= 2,
  `Expected both numeric .sort() calls to be flagged by require-array-sort-compare, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'require-array-sort-compare should be an error'
)

// An explicit comparator and a plain string sort must both pass.
const valid = await sortCompareMessages(
  'test/sort-compare/valid-number-sort.ts'
)
assert.strictEqual(
  valid.length,
  0,
  'Did not expect a comparator sort or a string-array sort to be flagged'
)

console.log('✅ All tests passed!')
