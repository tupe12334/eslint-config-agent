/**
 * Integration test for the `@typescript-eslint/no-use-before-define` rule
 * shipped by eslint-config-agent.
 *
 * Referencing a `let`/`const`/`class` binding before its textual declaration
 * does not read `undefined` — the Temporal Dead Zone makes it throw a
 * `ReferenceError` at runtime, so the file can type-check and look correct
 * while a particular code path only blows up when it actually executes. The
 * shared config must flag the unsafe forward reference (a TDZ-bound `let`
 * read before its declaration) while leaving the safe form (a hoisted
 * function declaration called before its textual definition) alone. This
 * guards against accidental removal of the rule and documents the intended
 * behavior.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const noUseBeforeDefineMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-use-before-define'
  )
}

console.log('Testing no-use-before-define rule from the shipped config...')

// A `let` read before its declaration must be flagged.
const invalid = await noUseBeforeDefineMessages(
  'test/no-use-before-define/invalid-no-use-before-define.ts'
)
assert.strictEqual(
  invalid.length,
  1,
  `Expected the TDZ forward reference to be flagged by no-use-before-define, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-use-before-define should be an error'
)

// A hoisted function declaration called before its textual definition must pass.
const valid = await noUseBeforeDefineMessages(
  'test/no-use-before-define/valid-no-use-before-define.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect a call to a hoisted function declaration to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
