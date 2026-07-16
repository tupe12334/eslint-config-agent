/**
 * Integration test for the `no-multi-assign` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject chained assignments (`a = b = c`), which bind
 * several targets in one expression, hide that more than one variable is being
 * written, and are an easy place to introduce an unintended shared reference.
 * Separate assignment statements must pass. This guards the rule against
 * accidental removal and documents the intended behavior. Run as a standalone
 * node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noMultiAssignMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-multi-assign-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-multi-assign')
}

console.log('Testing no-multi-assign rule from the shipped config...')

// A chained assignment must be flagged.
const chained = await noMultiAssignMessages(
  'export const run = () => {\n' +
    '  let a\n' +
    '  let b\n' +
    '  a = b = 1\n' +
    '  return a + b\n' +
    '}\n'
)
assert.ok(
  chained.length > 0,
  'Expected a chained assignment (a = b = 1) to be flagged'
)
assert.strictEqual(chained[0].severity, 2, 'no-multi-assign should be an error')

// Separate assignment statements must pass.
const separate = await noMultiAssignMessages(
  'export const run = () => {\n' +
    '  let a\n' +
    '  let b\n' +
    '  a = 1\n' +
    '  b = 1\n' +
    '  return a + b\n' +
    '}\n'
)
assert.strictEqual(
  separate.length,
  0,
  'Did not expect separate assignment statements to be flagged'
)

console.log('✅ All tests passed!')
