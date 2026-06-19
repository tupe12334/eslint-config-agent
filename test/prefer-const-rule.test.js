/**
 * Integration test for the `prefer-const` rule shipped by eslint-config-agent.
 *
 * The shared config must flag a `let` that is never reassigned, accept a
 * `const` binding, and leave a genuinely reassigned `let` alone. This guards
 * against accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 =
 * pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const preferConstMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'prefer-const-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'prefer-const')
}

console.log('Testing prefer-const rule from the shipped config...')

// A never-reassigned `let` must be flagged.
const neverReassigned = await preferConstMessages(
  'export const make = () => {\n  let value = 1\n  return value\n}\n'
)
assert.ok(
  neverReassigned.length > 0,
  'Expected a never-reassigned `let` to be flagged by prefer-const'
)
assert.strictEqual(
  neverReassigned[0].severity,
  2,
  'prefer-const should be an error'
)

// A `const` binding must pass.
const constBinding = await preferConstMessages(
  'export const make = () => {\n  const value = 1\n  return value\n}\n'
)
assert.strictEqual(
  constBinding.length,
  0,
  'Did not expect a `const` binding to be flagged by prefer-const'
)

// A genuinely reassigned `let` must pass.
const reassigned = await preferConstMessages(
  'export const make = () => {\n  let value = 1\n  value = 2\n  return value\n}\n'
)
assert.strictEqual(
  reassigned.length,
  0,
  'Did not expect a reassigned `let` to be flagged by prefer-const'
)

console.log('✅ All tests passed!')
