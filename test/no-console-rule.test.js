/**
 * Integration test for the `no-console` rule shipped by eslint-config-agent.
 *
 * The shared config must reject bare `console.log` in source (the archetypal
 * leftover-debugging statement) while still allowing the intentional
 * diagnostic channels `console.warn` and `console.error`. This guards against
 * accidental removal of the rule and documents the `allow: ['warn', 'error']`
 * configuration. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const consoleMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'console-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-console')
}

console.log('Testing no-console rule from the shipped config...')

// A bare `console.log` must be flagged.
const log = await consoleMessages(
  'export const greet = name => {\n  console.log(name)\n}\n'
)
assert.ok(
  log.length > 0,
  'Expected `console.log` to be flagged by the no-console rule'
)
assert.strictEqual(log[0].severity, 2, 'no-console should be an error')

// `console.warn` and `console.error` are explicitly allowed diagnostics.
const warnError = await consoleMessages(
  'export const report = err => {\n  console.warn(err)\n  console.error(err)\n}\n'
)
assert.strictEqual(
  warnError.length,
  0,
  'Did not expect `console.warn`/`console.error` to be flagged by the no-console rule'
)

console.log('✅ All tests passed!')
