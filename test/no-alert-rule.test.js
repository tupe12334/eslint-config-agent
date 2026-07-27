/**
 * Integration test for the `no-alert` rule shipped by eslint-config-agent.
 *
 * `alert()`, `confirm()`, and `prompt()` are browser debugging artifacts that
 * block the UI thread and must never reach production — the browser-native
 * siblings of `console.log` and `debugger` that `no-console` and `no-debugger`
 * already ban. The shared config must flag all three call forms while leaving
 * real UI interactions (e.g. modal components) alone. This guards against
 * accidental removal of the rule and documents the intended behavior. Run as a
 * standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noAlertMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-alert-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-alert')
}

console.log('Testing no-alert rule from the shipped config...')

// `alert()` is a browser debug artifact and must be flagged.
const alertMessages = await noAlertMessages(
  `export const show = value => {
  alert(value)
}
`
)
assert.ok(alertMessages.length > 0, 'Expected alert() to be flagged')
assert.strictEqual(alertMessages[0].severity, 2, 'no-alert should be an error')

// `confirm()` blocks the UI thread and must be flagged.
const confirmMessages = await noAlertMessages(
  `export const ask = () => {
  return confirm('Are you sure?')
}
`
)
assert.ok(confirmMessages.length > 0, 'Expected confirm() to be flagged')
assert.strictEqual(
  confirmMessages[0].severity,
  2,
  'no-alert should be an error for confirm()'
)

// `prompt()` blocks the UI thread and must be flagged.
const promptMessages = await noAlertMessages(
  `export const getName = () => {
  return prompt('Enter your name:')
}
`
)
assert.ok(promptMessages.length > 0, 'Expected prompt() to be flagged')
assert.strictEqual(
  promptMessages[0].severity,
  2,
  'no-alert should be an error for prompt()'
)

// A named function called `alert` from an import is not affected — `no-alert`
// only targets the global `alert` identifier, not all functions named `alert`.
const importedAlertMessages = await noAlertMessages(
  `import { showAlert } from './modal.js'
export const show = value => {
  showAlert(value)
}
`
)
assert.strictEqual(
  importedAlertMessages.length,
  0,
  'Did not expect a named import function to be flagged'
)

console.log('✅ All tests passed!')
