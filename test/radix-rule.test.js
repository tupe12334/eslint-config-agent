/**
 * Integration test for the `radix` rule shipped by eslint-config-agent.
 *
 * The shared config must require an explicit base argument to `parseInt`. With
 * the base omitted, `parseInt` infers it from the string (a leading `0x` is read
 * as hex), so the parse is non-deterministic and a quiet source of wrong-number
 * bugs — the same implicit-behavior class the config already bans via `eqeqeq`
 * and `no-implicit-coercion`. A call that passes the base explicitly must pass.
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const radixMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'radix-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'radix')
}

console.log('Testing radix rule from the shipped config...')

// `parseInt` without a radix must be flagged.
const missingRadix = await radixMessages("export const n = parseInt('08')\n")
assert.ok(
  missingRadix.length > 0,
  'Expected `parseInt` without a radix to be flagged'
)
assert.strictEqual(missingRadix[0].severity, 2, 'radix should be an error')

// A non-literal argument without a radix must also be flagged.
const dynamicMissingRadix = await radixMessages(
  'export const parse = value => parseInt(value)\n'
)
assert.ok(
  dynamicMissingRadix.length > 0,
  'Expected `parseInt(value)` without a radix to be flagged'
)

// `parseInt` with an explicit base must pass.
const explicit = await radixMessages("export const n = parseInt('08', 10)\n")
assert.strictEqual(
  explicit.length,
  0,
  'Did not expect `parseInt(str, 10)` to be flagged'
)

console.log('✅ All tests passed!')
