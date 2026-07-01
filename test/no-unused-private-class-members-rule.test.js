/**
 * Integration test for the `@typescript-eslint/no-unused-private-class-members`
 * rule shipped by eslint-config-agent.
 *
 * A `private` (or `#hashPrivate`) class field or method that is never read or
 * called anywhere in the class is dead code: because it is private, nothing
 * outside the class can be using it either, so there is no legitimate caller
 * left to account for. It is either a leftover from a refactor or a member
 * the author meant to wire up and never finished. The shared config must
 * flag a private field that is only ever written, never read, while leaving
 * a private field that is read back through a public accessor alone. This
 * guards against accidental removal of the rule and documents the intended
 * behavior.
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

// A private field that is only ever assigned, never read, must be flagged.
const invalid = await noUnusedPrivateClassMembersMessages(
  'test/no-unused-private-class-members/invalid-no-unused-private-class-members.ts'
)
assert.strictEqual(
  invalid.length,
  1,
  `Expected the write-only private field to be flagged by no-unused-private-class-members, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-unused-private-class-members should be an error'
)

// A private field read back through a public accessor must pass.
const valid = await noUnusedPrivateClassMembersMessages(
  'test/no-unused-private-class-members/valid-no-unused-private-class-members.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a private field read through a public accessor to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
