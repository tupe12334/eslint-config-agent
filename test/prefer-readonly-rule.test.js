/**
 * Integration test for the `@typescript-eslint/prefer-readonly` rule shipped by
 * eslint-config-agent.
 *
 * A private class member that is assigned once in the constructor and never
 * reassigned should be declared `readonly`; leaving it mutable lets a later
 * method (or an AI assistant extending the class) silently overwrite state the
 * rest of the class assumed was fixed. The shared config must flag such a
 * member while leaving already-`readonly` fields, genuinely reassigned fields,
 * and public members alone. This guards against accidental removal of the rule
 * and documents the intended behavior.
 *
 * The rule is type-aware, so the fixtures must be real on-disk files the
 * TypeScript project service can resolve (a synthetic `lintText` filePath gets
 * no type information). Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const preferReadonlyMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/prefer-readonly'
  )
}

console.log('Testing prefer-readonly rule from the shipped config...')

// Both the `private` field and the `#private` field assigned only in the
// constructor must be flagged.
const invalid = await preferReadonlyMessages(
  'test/prefer-readonly/invalid-mutable-private.ts'
)
assert.ok(
  invalid.length >= 2,
  `Expected both set-once private members to be flagged by prefer-readonly, got ${invalid.length}`
)
assert.strictEqual(invalid[0].severity, 2, 'prefer-readonly should be an error')

// An already-readonly field, a genuinely reassigned field, and a public field
// must all pass.
const valid = await preferReadonlyMessages(
  'test/prefer-readonly/valid-readonly-private.ts'
)
assert.strictEqual(
  valid.length,
  0,
  'Did not expect readonly/reassigned/public members to be flagged'
)

console.log('✅ All tests passed!')
