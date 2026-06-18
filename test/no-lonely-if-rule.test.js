/**
 * Integration test for the `no-lonely-if` rule shipped by eslint-config-agent.
 *
 * The shared config must reject an `if` that is the only statement inside an
 * `else` block (it should be written as `else if`), and accept both the
 * flattened `else if` chain and an `else` block that contains more than the
 * lone `if`. This guards against accidental removal of the rule and documents
 * the intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noLonelyIfMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-lonely-if-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-lonely-if')
}

console.log('Testing no-lonely-if rule from the shipped config...')

// A lone `if` as the only statement inside `else` must be flagged.
const lonelyIf = await noLonelyIfMessages(
  'export const classify = value => {\n' +
    '  if (value > 0) {\n' +
    "    return 'positive'\n" +
    '  } else {\n' +
    '    if (value < 0) {\n' +
    "      return 'negative'\n" +
    '    }\n' +
    '  }\n' +
    "  return 'zero'\n" +
    '}\n'
)
assert.ok(
  lonelyIf.length > 0,
  'Expected a lone `if` inside `else` to be flagged by no-lonely-if'
)
assert.strictEqual(lonelyIf[0].severity, 2, 'no-lonely-if should be an error')

// The flattened `else if` chain must pass.
const elseIfChain = await noLonelyIfMessages(
  'export const classify = value => {\n' +
    '  if (value > 0) {\n' +
    "    return 'positive'\n" +
    '  } else if (value < 0) {\n' +
    "    return 'negative'\n" +
    '  }\n' +
    "  return 'zero'\n" +
    '}\n'
)
assert.strictEqual(
  elseIfChain.length,
  0,
  'Did not expect the `else if` chain to be flagged by no-lonely-if'
)

// An `else` block with more than the lone `if` must pass.
const elseWithExtra = await noLonelyIfMessages(
  'export const classify = value => {\n' +
    '  let label = null\n' +
    '  if (value > 0) {\n' +
    "    label = 'positive'\n" +
    '  } else {\n' +
    '    if (value < 0) {\n' +
    "      label = 'negative'\n" +
    '    }\n' +
    "    label = label === null ? 'zero' : label\n" +
    '  }\n' +
    '  return label\n' +
    '}\n'
)
assert.strictEqual(
  elseWithExtra.length,
  0,
  'Did not expect an `else` block with extra statements to be flagged by no-lonely-if'
)

console.log('✅ All tests passed!')
