/**
 * Integration test for the `no-throw-literal` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject throwing a non-Error value (a string, number
 * or plain object literal) and accept throwing a real `Error` instance. This
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

const throwLiteralMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'throw-literal-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-throw-literal'
  )
}

console.log('Testing no-throw-literal rule from the shipped config...')

// Throwing a string literal must be flagged.
const throwString = await throwLiteralMessages(
  'export const fail = () => {\n  throw "boom"\n}\n'
)
assert.ok(
  throwString.length > 0,
  'Expected `throw "boom"` to be flagged by the no-throw-literal rule'
)
assert.strictEqual(
  throwString[0].severity,
  2,
  'no-throw-literal should be an error'
)

// Throwing a plain object literal must be flagged.
const throwObject = await throwLiteralMessages(
  'export const fail = () => {\n  throw { code: 500 }\n}\n'
)
assert.ok(
  throwObject.length > 0,
  'Expected `throw { code: 500 }` to be flagged by the no-throw-literal rule'
)

// Throwing a real Error instance must pass.
const throwError = await throwLiteralMessages(
  'export const fail = () => {\n  throw new Error("boom")\n}\n'
)
assert.strictEqual(
  throwError.length,
  0,
  'Did not expect `throw new Error(...)` to be flagged by no-throw-literal'
)

console.log('✅ All tests passed!')
