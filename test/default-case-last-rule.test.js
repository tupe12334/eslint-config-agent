/**
 * Integration test for the `default-case-last` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must require the `default` clause of a `switch` to come
 * last. A `default` written before later cases reads as if those cases were
 * unreachable, and a mid-`switch` `default` that omits `break` falls through
 * into the cases below it — the "looks one way, behaves another" footgun this
 * config exists to surface. A `switch` whose `default` is last must pass. Run as
 * a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const defaultCaseLastMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'default-case-last-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'default-case-last'
  )
}

console.log('Testing default-case-last rule from the shipped config...')

// A `default` clause placed before later cases must be flagged.
const nonLastDefault = await defaultCaseLastMessages(
  `export const label = value => {
  switch (value) {
    default:
      return 'other'
    case 1:
      return 'one'
  }
}
`
)
assert.ok(
  nonLastDefault.length > 0,
  'Expected a non-last `default` clause to be flagged'
)
assert.strictEqual(
  nonLastDefault[0].severity,
  2,
  'default-case-last should be an error'
)

// A `default` clause that comes last must pass.
const lastDefault = await defaultCaseLastMessages(
  `export const label = value => {
  switch (value) {
    case 1:
      return 'one'
    default:
      return 'other'
  }
}
`
)
assert.strictEqual(
  lastDefault.length,
  0,
  'Did not expect a last `default` clause to be flagged'
)

console.log('✅ All tests passed!')
