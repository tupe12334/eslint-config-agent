/**
 * Integration test for the `no-unneeded-ternary` rule shipped by
 * eslint-config-agent.
 *
 * A ternary whose branches are boolean literals (`cond ? true : false`) or
 * that re-tests a value it could fall through to (`a ? a : b`) is the flat
 * sibling of the nested ternaries this config already bans: punctuation-heavy
 * dressing around a plain boolean or the condition itself. The shared config
 * must reject these while still accepting a genuine ternary that selects
 * between two distinct values. This guards against accidental removal of the
 * rule and documents the intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const unneededTernaryMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'unneeded-ternary-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-unneeded-ternary'
  )
}

console.log('Testing no-unneeded-ternary rule from the shipped config...')

// A ternary that returns boolean literals must be flagged.
const booleanLiterals = await unneededTernaryMessages(
  'export const isPositive = (value) => {\n' +
    '  return value > 0 ? true : false\n' +
    '}\n'
)
assert.ok(
  booleanLiterals.length > 0,
  'Expected `cond ? true : false` to be flagged by the no-unneeded-ternary rule'
)
assert.strictEqual(
  booleanLiterals[0].severity,
  2,
  'no-unneeded-ternary should be an error'
)

// The `a ? a : b` default-value idiom must be flagged (defaultAssignment: false).
const defaultAssignment = await unneededTernaryMessages(
  'export const orFallback = (value, fallback) => {\n' +
    '  return value ? value : fallback\n' +
    '}\n'
)
assert.ok(
  defaultAssignment.length > 0,
  'Expected `a ? a : b` to be flagged by the no-unneeded-ternary rule'
)

// A genuine ternary selecting between two distinct values must pass.
const genuine = await unneededTernaryMessages(
  'export const label = (value) => {\n' +
    "  return value > 0 ? 'positive' : 'non-positive'\n" +
    '}\n'
)
assert.strictEqual(
  genuine.length,
  0,
  'Did not expect a genuine two-value ternary to be flagged by the no-unneeded-ternary rule'
)

console.log('✅ All tests passed!')
