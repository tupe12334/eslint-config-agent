/**
 * Integration test for the `prefer-exponentiation-operator` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject `Math.pow(base, exponent)` in favour of the
 * `**` exponentiation operator, which states mathematical intent directly
 * rather than routing it through a function call. A plain `**` expression must
 * pass. This guards against accidental removal of the rule and documents the
 * intended behavior. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const preferExponentiationMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'prefer-exponentiation-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'prefer-exponentiation-operator'
  )
}

console.log(
  'Testing prefer-exponentiation-operator rule from the shipped config...'
)

// `Math.pow(base, exp)` must be flagged.
const mathPow = await preferExponentiationMessages(
  'export const squared = Math.pow(x, 2)\n'
)
assert.ok(mathPow.length > 0, 'Expected `Math.pow(x, 2)` to be flagged')
assert.strictEqual(
  mathPow[0].severity,
  2,
  'prefer-exponentiation-operator should be an error'
)

// Nested `Math.pow` must also be flagged.
const nestedMathPow = await preferExponentiationMessages(
  'export const result = Math.pow(Math.pow(2, 3), 4)\n'
)
assert.ok(nestedMathPow.length > 0, 'Expected nested `Math.pow` to be flagged')

// The `**` operator must pass.
const exponentiation = await preferExponentiationMessages(
  'export const squared = x ** 2\n'
)
assert.strictEqual(
  exponentiation.length,
  0,
  'Did not expect `x ** 2` to be flagged'
)

console.log('✅ All tests passed!')
