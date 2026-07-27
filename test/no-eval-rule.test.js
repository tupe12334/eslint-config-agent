/**
 * Integration tests for the `no-eval` and `no-implied-eval` rules shipped by
 * eslint-config-agent.
 *
 * `eval()` hands a string to the JavaScript engine at runtime: the body is
 * opaque to the parser, the type checker and every reader, it can reach and
 * mutate the surrounding scope, and feeding it any untrusted input is the
 * textbook code-injection hole. `no-implied-eval` covers the indirect channel:
 * a string first argument to `setTimeout`, `setInterval`, or `setImmediate`
 * makes the engine `eval` it on the timer's behalf — the same hazard hidden
 * behind an everyday timer API.
 *
 * Both rules are enabled as `error` in the shared config (not in
 * `eslint:recommended`, so they are turned on explicitly). This test guards
 * against accidental removal and documents the expected behavior.
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

/**
 * Lint the given code snippet as a `.js` file and return only the messages
 * whose `ruleId` matches the provided rule name.
 * @param code - Source code to lint.
 * @param ruleId - The rule ID to filter messages by.
 * @returns Matching messages.
 */
const messagesFor = async (code, ruleId) => {
  const [result] = await eslint.lintText(code, {
    filePath: `${ruleId}-sample.js`,
  })
  return result.messages.filter(message => message.ruleId === ruleId)
}

console.log(
  'Testing no-eval and no-implied-eval rules from the shipped config...'
)

// ─── no-eval ────────────────────────────────────────────────────────────────

// Direct `eval('...')` with a string literal must be flagged.
const evalStringMessages = await messagesFor(
  `export const run = code => {
  return eval(code)
}
`,
  'no-eval'
)
assert.ok(evalStringMessages.length > 0, 'Expected eval() to be flagged')
assert.strictEqual(
  evalStringMessages[0].severity,
  2,
  'no-eval should be an error'
)

// `eval` called via member expression (`window.eval`) must also be flagged.
const windowEvalMessages = await messagesFor(
  `export const run = code => {
  return window.eval(code)
}
`,
  'no-eval'
)
assert.ok(windowEvalMessages.length > 0, 'Expected window.eval() to be flagged')

// A safe dynamic dispatch (no eval) must NOT be flagged.
const safeCallMessages = await messagesFor(
  `export const run = fn => {
  return fn()
}
`,
  'no-eval'
)
assert.strictEqual(
  safeCallMessages.length,
  0,
  'Did not expect a plain function call to be flagged by no-eval'
)

// ─── no-implied-eval ─────────────────────────────────────────────────────────

// `setTimeout` with a string first argument is implied eval and must be flagged.
const setTimeoutStringMessages = await messagesFor(
  `export const schedule = () => {
  setTimeout('doWork()', 1000)
}
`,
  'no-implied-eval'
)
assert.ok(
  setTimeoutStringMessages.length > 0,
  'Expected setTimeout with a string argument to be flagged'
)
assert.strictEqual(
  setTimeoutStringMessages[0].severity,
  2,
  'no-implied-eval should be an error'
)

// `setInterval` with a string first argument must also be flagged.
const setIntervalStringMessages = await messagesFor(
  `export const poll = () => {
  setInterval('checkStatus()', 5000)
}
`,
  'no-implied-eval'
)
assert.ok(
  setIntervalStringMessages.length > 0,
  'Expected setInterval with a string argument to be flagged'
)

// `setTimeout` with a function (the safe form) must NOT be flagged.
const setTimeoutFunctionMessages = await messagesFor(
  `export const schedule = callback => {
  setTimeout(() => { callback() }, 1000)
}
`,
  'no-implied-eval'
)
assert.strictEqual(
  setTimeoutFunctionMessages.length,
  0,
  'Did not expect setTimeout with a function to be flagged'
)

console.log('✅ All tests passed!')
