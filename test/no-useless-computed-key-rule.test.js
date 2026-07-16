/**
 * Integration test for the `no-useless-computed-key` rule shipped by
 * eslint-config-agent.
 *
 * A computed key that wraps a static literal (`{ ['name']: x }`, `{ [42]: y }`,
 * `class { ['method']() {} }`) buys nothing over the plain key it could be —
 * the bracket syntax only signals a runtime computation that never happens,
 * adding punctuation and a layer of indirection the reader has to unwind. It is
 * the same "clever but pointless" clutter this config bans elsewhere, and one
 * AI assistants emit when they template object keys mechanically. The shared
 * config must flag those keys (including class members, via
 * `enforceForClassMembers: true`) while leaving genuinely-computed keys alone.
 * This guards against accidental removal of the rule and documents the intended
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

const computedKeyMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-useless-computed-key-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-useless-computed-key'
  )
}

console.log('Testing no-useless-computed-key rule from the shipped config...')

// A computed key wrapping a string literal must be flagged.
const stringKey = await computedKeyMessages(
  "export const settings = { ['name']: 'value' }\n"
)
assert.ok(
  stringKey.length > 0,
  'Expected a computed string-literal key to be flagged by no-useless-computed-key'
)
assert.strictEqual(
  stringKey[0].severity,
  2,
  'no-useless-computed-key should be an error'
)

// A computed class member key wrapping a literal must be flagged
// (enforceForClassMembers: true).
const classKey = await computedKeyMessages(
  'export class Service {\n' +
    "  ['run']() {\n" +
    '    return 1\n' +
    '  }\n' +
    '}\n'
)
assert.ok(
  classKey.length > 0,
  'Expected a computed class-member literal key to be flagged (enforceForClassMembers)'
)

// A plain key and a genuinely-computed key must both pass.
const valid = await computedKeyMessages(
  'const dynamic = String(Math.trunc(1))\n' +
    "export const settings = { name: 'value', [dynamic]: 'computed' }\n"
)
assert.strictEqual(
  valid.length,
  0,
  'Did not expect a plain key or a genuinely-computed key to be flagged'
)

console.log('✅ All tests passed!')
