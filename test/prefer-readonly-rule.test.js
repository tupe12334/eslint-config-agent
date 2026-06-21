/**
 * Integration test for the `@typescript-eslint/prefer-readonly` rule shipped by
 * eslint-config-agent.
 *
 * A private class member that is only ever assigned in its declaration or the
 * constructor is conceptually fixed after construction; leaving it writable
 * lets a stray reassignment compile silently. The shared config must flag such
 * a member (it should be declared `readonly`) while leaving an already-readonly
 * member alone. This guards against accidental removal of the rule and
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

const preferReadonlyMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/prefer-readonly'
  )
}

console.log(
  'Testing @typescript-eslint/prefer-readonly rule from the shipped config...'
)

// A private member assigned only in the constructor must be flagged.
const invalid = await preferReadonlyMessages(
  'test/prefer-readonly/invalid-mutable-member.ts'
)
assert.ok(
  invalid.length > 0,
  'Expected a constructor-only private member to be flagged by prefer-readonly'
)
assert.strictEqual(invalid[0].severity, 2, 'prefer-readonly should be an error')

// A member already declared `readonly` must pass.
const valid = await preferReadonlyMessages(
  'test/prefer-readonly/valid-readonly-member.ts'
)
assert.strictEqual(
  valid.length,
  0,
  'Did not expect an already-readonly member to be flagged by prefer-readonly'
)

console.log('✅ All tests passed!')
