/**
 * Integration test for the `no-implicit-coercion` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject shorthand type-coercion idioms: `!!value`
 * (boolean), `+str` (number), and `"" + n` (string). The explicit forms
 * `Boolean(value)`, `Number(str)`, and `String(n)` must pass. This guards
 * against accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const implicitCoercionMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'implicit-coercion-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-implicit-coercion'
  )
}

console.log('Testing no-implicit-coercion rule from the shipped config...')

// `!!value` (double-negation boolean cast) must be flagged.
const doubleNegation = await implicitCoercionMessages(
  'export const toBool = value => !!value\n'
)
assert.ok(
  doubleNegation.length > 0,
  'Expected `!!value` to be flagged by no-implicit-coercion'
)
assert.strictEqual(
  doubleNegation[0].severity,
  2,
  'no-implicit-coercion should be an error'
)

// `+str` (unary plus number cast) must be flagged.
const unaryPlus = await implicitCoercionMessages(
  'export const toNum = str => +str\n'
)
assert.ok(
  unaryPlus.length > 0,
  'Expected `+str` to be flagged by no-implicit-coercion'
)

// `Boolean(value)` (explicit boolean cast) must pass.
const explicitBoolean = await implicitCoercionMessages(
  'export const toBool = value => Boolean(value)\n'
)
assert.strictEqual(
  explicitBoolean.length,
  0,
  'Did not expect `Boolean(value)` to be flagged by no-implicit-coercion'
)

// `Number(str)` (explicit number cast) must pass.
const explicitNumber = await implicitCoercionMessages(
  'export const toNum = str => Number(str)\n'
)
assert.strictEqual(
  explicitNumber.length,
  0,
  'Did not expect `Number(str)` to be flagged by no-implicit-coercion'
)

// `String(n)` (explicit string cast) must pass.
const explicitString = await implicitCoercionMessages(
  'export const toStr = n => String(n)\n'
)
assert.strictEqual(
  explicitString.length,
  0,
  'Did not expect `String(n)` to be flagged by no-implicit-coercion'
)

console.log('✅ All tests passed!')
