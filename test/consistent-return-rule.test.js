/**
 * Integration test for the `consistent-return` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject a function whose `return` statements are
 * inconsistent — some yielding a value while another branch falls through or
 * uses a bare `return;` — and accept functions that are uniformly
 * value-returning or uniformly value-less. This guards against accidental
 * removal of the rule and documents the intended behavior. Run as a standalone
 * node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const consistentReturnMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'consistent-return-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'consistent-return'
  )
}

console.log('Testing consistent-return rule from the shipped config...')

// A value on one branch and an implicit fall-through on another must be flagged.
const mixedFallThrough = await consistentReturnMessages(
  'export const pick = value => {\n' +
    '  if (value > 0) {\n' +
    '    return value\n' +
    '  }\n' +
    '}\n'
)
assert.ok(
  mixedFallThrough.length > 0,
  'Expected a value-returning branch with an implicit fall-through to be flagged by consistent-return'
)
assert.strictEqual(
  mixedFallThrough[0].severity,
  2,
  'consistent-return should be an error'
)

// A value on one branch and a bare `return;` on another must also be flagged.
const mixedBareReturn = await consistentReturnMessages(
  'export const pick = value => {\n' +
    '  if (value > 0) {\n' +
    '    return value\n' +
    '  }\n' +
    '  return\n' +
    '}\n'
)
assert.ok(
  mixedBareReturn.length > 0,
  'Expected a bare `return;` alongside a value-returning branch to be flagged by consistent-return'
)

// A function that returns a value on every path must pass.
const allValues = await consistentReturnMessages(
  'export const pick = value => {\n' +
    '  if (value > 0) {\n' +
    '    return value\n' +
    '  }\n' +
    '  return 0\n' +
    '}\n'
)
assert.strictEqual(
  allValues.length,
  0,
  'Did not expect a uniformly value-returning function to be flagged by consistent-return'
)

// A function that never returns a value must pass.
const noValues = await consistentReturnMessages(
  'export const run = value => {\n' +
    '  if (value > 0) {\n' +
    '    return\n' +
    '  }\n' +
    '  doWork()\n' +
    '}\n'
)
assert.strictEqual(
  noValues.length,
  0,
  'Did not expect a uniformly value-less function to be flagged by consistent-return'
)

console.log('✅ All tests passed!')
