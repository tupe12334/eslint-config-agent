/**
 * Integration test for the `consistent-return` rule shipped by eslint-config-agent.
 *
 * The shared config must reject a function whose `return` statements mix a
 * value-returning branch with a fall-through or bare `return;` branch, while
 * allowing functions whose returns are uniformly value-returning or uniformly
 * value-less. This guards against accidental removal of the rule and documents
 * the intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const consistentReturnMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'consistent-return-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'consistent-return'
  )
}

console.log('Testing consistent-return rule from the shipped config...')

// A value-returning branch followed by an implicit fall-through must be flagged.
const fallThrough = await consistentReturnMessages(
  `export const pick = value => {
  if (value > 0) {
    return value
  }
}
`
)
assert.ok(
  fallThrough.length > 0,
  'Expected a value-returning branch with an implicit fall-through to be flagged'
)
assert.strictEqual(
  fallThrough[0].severity,
  2,
  'consistent-return should be an error'
)

// A value-returning branch followed by a bare `return;` must be flagged.
const bareReturn = await consistentReturnMessages(
  `export const pick = value => {
  if (value > 0) {
    return value
  }
  return
}
`
)
assert.ok(
  bareReturn.length > 0,
  'Expected a value-returning branch mixed with a bare `return;` to be flagged'
)

// Uniformly value-returning functions must NOT be flagged.
const uniformValue = await consistentReturnMessages(
  `export const pick = value => {
  if (value > 0) {
    return value
  }
  return 0
}
`
)
assert.strictEqual(
  uniformValue.length,
  0,
  'Did not expect a uniformly value-returning function to be flagged'
)

// Uniformly value-less functions must NOT be flagged.
const uniformVoid = await consistentReturnMessages(
  `export const log = value => {
  if (value > 0) {
    console.log(value)
    return
  }
  console.log('none')
}
`
)
assert.strictEqual(
  uniformVoid.length,
  0,
  'Did not expect a uniformly value-less function to be flagged'
)

console.log('✅ All tests passed!')
