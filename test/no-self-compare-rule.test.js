/**
 * Integration test for the `no-self-compare` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject comparisons of a value against itself (the
 * archetypal `value !== value` NaN trick, and the plain `x === x` bug) and
 * accept comparisons between two distinct operands. This guards against
 * accidental removal of the rule and documents the intended behavior. Run as a
 * standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const selfCompareMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'self-compare-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-self-compare')
}

console.log('Testing no-self-compare rule from the shipped config...')

// The `value !== value` NaN trick must be flagged.
const nanTrick = await selfCompareMessages(
  'export const isNan = value => {\n  return value !== value\n}\n'
)
assert.ok(
  nanTrick.length > 0,
  'Expected `value !== value` to be flagged by the no-self-compare rule'
)
assert.strictEqual(
  nanTrick[0].severity,
  2,
  'no-self-compare should be an error'
)

// A self `===` comparison must be flagged.
const strictSelf = await selfCompareMessages(
  'export const isSame = value => {\n  return value === value\n}\n'
)
assert.ok(
  strictSelf.length > 0,
  'Expected `value === value` to be flagged by the no-self-compare rule'
)

// Comparing two distinct operands must pass.
const distinctOperands = await selfCompareMessages(
  'export const isEqual = (a, b) => {\n  return a === b\n}\n'
)
assert.strictEqual(
  distinctOperands.length,
  0,
  'Did not expect distinct operands to be flagged by the no-self-compare rule'
)

console.log('✅ All tests passed!')
