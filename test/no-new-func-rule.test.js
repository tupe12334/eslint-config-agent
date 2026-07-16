/**
 * Integration test for the `no-new-func` rule shipped by eslint-config-agent.
 *
 * The shared config must reject building functions from strings via the
 * `Function` constructor (`new Function(...)` / `Function(...)`) — this is
 * `eval` under another name: an opaque string body that runs in the global
 * scope and is a direct code-injection hole when fed untrusted input. A normal
 * function literal must pass. This guards a security-relevant rule against
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

const noNewFuncMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-new-func-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-new-func')
}

console.log('Testing no-new-func rule from the shipped config...')

// `new Function(...)` with a string body must be flagged.
const newFunction = await noNewFuncMessages(
  "export const add = new Function('a', 'b', 'return a + b')\n"
)
assert.ok(newFunction.length > 0, 'Expected `new Function(...)` to be flagged')
assert.strictEqual(newFunction[0].severity, 2, 'no-new-func should be an error')

// The call form `Function(...)` must also be flagged.
const callFunction = await noNewFuncMessages(
  "export const double = Function('x', 'return x * 2')\n"
)
assert.ok(
  callFunction.length > 0,
  'Expected the `Function(...)` call form to be flagged'
)

// A plain function literal must pass.
const literal = await noNewFuncMessages('export const add = (a, b) => a + b\n')
assert.strictEqual(
  literal.length,
  0,
  'Did not expect a normal function literal to be flagged'
)

console.log('✅ All tests passed!')
