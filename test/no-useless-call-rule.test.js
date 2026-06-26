/**
 * Integration test for the `no-useless-call` rule shipped by
 * eslint-config-agent.
 *
 * `.call(null, ...)` and `.apply(undefined, [...])` with a null/undefined
 * first argument behave identically to a direct invocation — the `this`
 * rebinding is a no-op — so the wrapper is pure overhead. The shared config
 * must flag these useless indirect calls while leaving direct calls and
 * `.call()` with a meaningful receiver alone. This guards against accidental
 * removal of the rule and documents the intended behavior.
 *
 * Run as a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noUselessCallMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-useless-call-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-useless-call')
}

console.log('Testing no-useless-call rule from the shipped config...')

// `.call(null, arg)` with a null receiver must be flagged — it is identical
// to a direct call and misleads the reader.
const callNull = await noUselessCallMessages(`
export const greet = name => \`Hello, \${name}\`
export const result = greet.call(null, 'Alice')
`)
assert.ok(
  callNull.length > 0,
  `Expected greet.call(null, ...) to be flagged, got ${callNull.length}`
)
assert.strictEqual(
  callNull[0].severity,
  2,
  'no-useless-call should be an error'
)

// `.apply(undefined, [...])` with an undefined receiver must be flagged.
const applyUndefined = await noUselessCallMessages(`
export const greet = name => \`Hello, \${name}\`
export const result = greet.apply(undefined, ['Bob'])
`)
assert.ok(
  applyUndefined.length > 0,
  `Expected greet.apply(undefined, ...) to be flagged, got ${applyUndefined.length}`
)

// A direct call must pass.
const direct = await noUselessCallMessages(`
export const greet = name => \`Hello, \${name}\`
export const result = greet('Alice')
`)
assert.strictEqual(
  direct.length,
  0,
  `Did not expect a direct call to be flagged, got ${direct.length}`
)

console.log('✅ All tests passed!')
