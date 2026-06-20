/**
 * Integration test for the `no-useless-return` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag a redundant trailing `return;` that changes
 * nothing (control already falls off the end of the function) and must leave a
 * `return` that performs an early exit alone. This guards against accidental
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

const noUselessReturnMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-useless-return-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-useless-return'
  )
}

console.log('Testing no-useless-return rule from the shipped config...')

// A `return;` that is the last statement of a function changes nothing and
// must be flagged.
const trailingReturn = await noUselessReturnMessages(
  'export const notify = value => {\n' +
    '  console.log(value)\n' +
    '  return\n' +
    '}\n'
)
assert.ok(
  trailingReturn.length > 0,
  'Expected a redundant trailing `return` to be flagged by no-useless-return'
)
assert.strictEqual(
  trailingReturn[0].severity,
  2,
  'no-useless-return should be an error'
)

// A `return` used as a genuine early exit (control would otherwise continue)
// must NOT be flagged.
const earlyExit = await noUselessReturnMessages(
  'export const notify = value => {\n' +
    '  if (value > 0) {\n' +
    '    return\n' +
    '  }\n' +
    '  console.log(value)\n' +
    '}\n'
)
assert.strictEqual(
  earlyExit.length,
  0,
  'Did not expect a real early-exit `return` to be flagged by no-useless-return'
)

console.log('✅ All tests passed!')
