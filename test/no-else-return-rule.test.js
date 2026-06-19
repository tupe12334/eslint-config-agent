/**
 * Integration test for the `no-else-return` rule shipped by eslint-config-agent.
 *
 * The shared config must reject an `else`/`else if` block when the preceding
 * `if` already returns, and accept the flattened guard-clause form. This guards
 * against accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noElseReturnMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-else-return-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-else-return')
}

console.log('Testing no-else-return rule from the shipped config...')

// `else` after a returning `if` must be flagged.
const elseAfterReturn = await noElseReturnMessages(
  'export const classify = value => {\n' +
    '  if (value > 0) {\n' +
    "    return 'positive'\n" +
    '  } else {\n' +
    "    return 'non-positive'\n" +
    '  }\n' +
    '}\n'
)
assert.ok(
  elseAfterReturn.length > 0,
  'Expected an `else` after a returning `if` to be flagged by no-else-return'
)
assert.strictEqual(
  elseAfterReturn[0].severity,
  2,
  'no-else-return should be an error'
)

// `else if` after a returning `if` must also be flagged (allowElseIf: false).
const elseIfAfterReturn = await noElseReturnMessages(
  'export const classify = value => {\n' +
    '  if (value > 0) {\n' +
    "    return 'positive'\n" +
    '  } else if (value < 0) {\n' +
    "    return 'negative'\n" +
    '  }\n' +
    "  return 'zero'\n" +
    '}\n'
)
assert.ok(
  elseIfAfterReturn.length > 0,
  'Expected an `else if` after a returning `if` to be flagged by no-else-return'
)

// The flattened guard-clause form must pass.
const guardClause = await noElseReturnMessages(
  'export const classify = value => {\n' +
    '  if (value > 0) {\n' +
    "    return 'positive'\n" +
    '  }\n' +
    "  return 'non-positive'\n" +
    '}\n'
)
assert.strictEqual(
  guardClause.length,
  0,
  'Did not expect the guard-clause form to be flagged by no-else-return'
)

console.log('✅ All tests passed!')
