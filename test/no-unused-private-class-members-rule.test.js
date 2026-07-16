/**
 * Integration test for the `@typescript-eslint/no-unused-private-class-members`
 * rule shipped by eslint-config-agent.
 *
 * A `private` (TypeScript keyword) or `#hashPrivate` class field/method that
 * is declared and never read anywhere in the class body is dead code — there
 * is no legitimate external caller to account for. The shared config must
 * flag every such member and leave members that are actually used alone.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noUnusedPrivateClassMembersMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message =>
      message.ruleId === '@typescript-eslint/no-unused-private-class-members'
  )
}

console.log(
  'Testing no-unused-private-class-members rule from the shipped config...'
)

// An unread private field must be flagged.
const invalid = await noUnusedPrivateClassMembersMessages(
  'test/no-unused-private-class-members/invalid-unused-private-class-members.ts'
)
assert.ok(
  invalid.length > 0,
  `Expected an unused private class member to be flagged, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-unused-private-class-members should be an error'
)

// A private field read elsewhere in the class must not be flagged.
const valid = await noUnusedPrivateClassMembersMessages(
  'test/no-unused-private-class-members/valid-unused-private-class-members.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a used private class member to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
