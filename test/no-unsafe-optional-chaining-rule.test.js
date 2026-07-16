/**
 * Integration test for the `no-unsafe-optional-chaining` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject optional-chaining expressions whose
 * short-circuit to `undefined` is then used in a position that throws at
 * runtime — member access on the result (`(obj?.foo).bar`), a call
 * (`(obj?.fn)()`), or arithmetic (`(obj?.count) + 1`) — and accept a fully
 * extended optional chain (`obj?.foo?.bar`). This guards against accidental
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

const unsafeOptionalChainingMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'unsafe-optional-chaining-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-unsafe-optional-chaining'
  )
}

console.log(
  'Testing no-unsafe-optional-chaining rule from the shipped config...'
)

// Member access on a short-circuited chain must be flagged.
const unsafeMember = await unsafeOptionalChainingMessages(
  'export const read = obj => {\n  return (obj?.foo).bar\n}\n'
)
assert.ok(
  unsafeMember.length > 0,
  'Expected `(obj?.foo).bar` to be flagged by the no-unsafe-optional-chaining rule'
)
assert.strictEqual(
  unsafeMember[0].severity,
  2,
  'no-unsafe-optional-chaining should be an error'
)

// Calling a short-circuited chain must be flagged.
const unsafeCall = await unsafeOptionalChainingMessages(
  'export const run = obj => {\n  return (obj?.fn)()\n}\n'
)
assert.ok(
  unsafeCall.length > 0,
  'Expected `(obj?.fn)()` to be flagged by the no-unsafe-optional-chaining rule'
)

// Arithmetic on a short-circuited chain must be flagged
// (disallowArithmeticOperators: true).
const unsafeArithmetic = await unsafeOptionalChainingMessages(
  'export const add = obj => {\n  return (obj?.count) + 1\n}\n'
)
assert.ok(
  unsafeArithmetic.length > 0,
  'Expected `(obj?.count) + 1` to be flagged by the no-unsafe-optional-chaining rule'
)

// A fully extended optional chain must pass.
const safeChain = await unsafeOptionalChainingMessages(
  'export const read = obj => {\n  return obj?.foo?.bar\n}\n'
)
assert.strictEqual(
  safeChain.length,
  0,
  'Did not expect a fully extended optional chain to be flagged by the no-unsafe-optional-chaining rule'
)

console.log('✅ All tests passed!')
