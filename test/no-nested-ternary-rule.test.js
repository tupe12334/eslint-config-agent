/**
 * Integration test for nested-ternary coverage shipped by eslint-config-agent.
 *
 * `unicorn.configs.all` provides `unicorn/no-nested-ternary` and disables the
 * core `no-nested-ternary` rule, so this test checks the unicorn variant.
 * Nested ternaries are the archetypal "clever but unreadable" construct this
 * config exists to prevent, so the shared config must reject a ternary nested
 * inside another ternary while still accepting a single, flat ternary. This
 * guards against accidental removal of the rule and documents the intended
 * behavior. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const nestedTernaryMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'nested-ternary-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'unicorn/no-nested-ternary'
  )
}

console.log('Testing no-nested-ternary rule from the shipped config...')

// A ternary nested inside another ternary must be flagged.
const nested = await nestedTernaryMessages(
  'export const label = (value) => {\n' +
    "  return value > 0 ? 'positive' : value < 0 ? 'negative' : 'zero'\n" +
    '}\n'
)
assert.ok(
  nested.length > 0,
  'Expected a nested ternary to be flagged by the unicorn/no-nested-ternary rule'
)
assert.strictEqual(
  nested[0].severity,
  2,
  'unicorn/no-nested-ternary should be an error'
)

// A single, flat ternary must pass.
const flat = await nestedTernaryMessages(
  'export const label = (value) => {\n' +
    "  return value > 0 ? 'positive' : 'non-positive'\n" +
    '}\n'
)
assert.strictEqual(
  flat.length,
  0,
  'Did not expect a single flat ternary to be flagged by the unicorn/no-nested-ternary rule'
)

console.log('✅ All tests passed!')
