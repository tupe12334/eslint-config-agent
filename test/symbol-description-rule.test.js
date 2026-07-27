/**
 * Integration test for the `symbol-description` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must require a description when calling `Symbol()`.
 * An anonymous `Symbol()` (no argument) must be flagged; `Symbol('name')`
 * and `Symbol.for('name')` must pass. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const symbolDescMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'symbol-description-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'symbol-description'
  )
}

console.log('Testing symbol-description rule from the shipped config...')

// `Symbol()` with no description must be flagged.
const anonymousSymbol = await symbolDescMessages(
  'export const MY_KEY = Symbol()\n'
)
assert.ok(
  anonymousSymbol.length > 0,
  'Expected `Symbol()` without a description to be flagged by symbol-description'
)
assert.strictEqual(
  anonymousSymbol[0].severity,
  2,
  'symbol-description should be an error'
)

// `Symbol('description')` must pass.
const namedSymbol = await symbolDescMessages(
  "export const MY_KEY = Symbol('myKey')\n"
)
assert.strictEqual(
  namedSymbol.length,
  0,
  "Did not expect `Symbol('description')` to be flagged by symbol-description"
)

// `Symbol.for('key')` must pass — it is a registry look-up, not an anonymous Symbol.
const symbolFor = await symbolDescMessages(
  "export const MY_KEY = Symbol.for('myKey')\n"
)
assert.strictEqual(
  symbolFor.length,
  0,
  'Did not expect `Symbol.for(...)` to be flagged by symbol-description'
)

// `Symbol(variable)` must pass — the description is provided, even if dynamic.
const symbolWithVariable = await symbolDescMessages(
  'export const makeKey = name => Symbol(name)\n'
)
assert.strictEqual(
  symbolWithVariable.length,
  0,
  'Did not expect `Symbol(variable)` to be flagged by symbol-description'
)

console.log('✅ All tests passed!')
