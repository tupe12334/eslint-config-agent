/**
 * Integration test for the `no-eval` and `no-implied-eval` rules shipped by
 * eslint-config-agent.
 *
 * The shared config must reject runtime code execution from strings — `eval`
 * (even with a string literal, which `eslint-plugin-security` lets through) and
 * the implied-eval forms (`setTimeout`/`setInterval` with a string body) — and
 * accept the safe equivalents (passing a real function). This guards against
 * accidental removal of the rules and documents the intended behavior. Run as a
 * standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const messagesFor = async (code, ruleId) => {
  const [result] = await eslint.lintText(code, {
    filePath: 'eval-sample.js',
  })
  return result.messages.filter(message => message.ruleId === ruleId)
}

console.log(
  'Testing no-eval / no-implied-eval rules from the shipped config...'
)

// A direct `eval` call with a string literal must be flagged. This is the gap
// `eslint-plugin-security`'s detect-eval-with-expression leaves open.
const literalEval = await messagesFor(
  "export const run = () => {\n  return eval('1 + 1')\n}\n",
  'no-eval'
)
assert.ok(
  literalEval.length > 0,
  "Expected `eval('1 + 1')` to be flagged by the no-eval rule"
)
assert.strictEqual(literalEval[0].severity, 2, 'no-eval should be an error')

// `eval` with a dynamic expression must also be flagged.
const dynamicEval = await messagesFor(
  'export const run = source => {\n  return eval(source)\n}\n',
  'no-eval'
)
assert.ok(
  dynamicEval.length > 0,
  'Expected `eval(source)` to be flagged by the no-eval rule'
)

// `setTimeout` with a string body must be flagged by no-implied-eval.
const impliedEval = await messagesFor(
  "export const run = () => {\n  setTimeout('doThing()', 0)\n}\n",
  'no-implied-eval'
)
assert.ok(
  impliedEval.length > 0,
  "Expected `setTimeout('doThing()', 0)` to be flagged by no-implied-eval"
)
assert.strictEqual(
  impliedEval[0].severity,
  2,
  'no-implied-eval should be an error'
)

// Passing a real function to setTimeout must pass — the safe equivalent.
const safeTimeout = await messagesFor(
  'export const run = () => {\n  setTimeout(() => doThing(), 0)\n}\n',
  'no-implied-eval'
)
assert.strictEqual(
  safeTimeout.length,
  0,
  'Did not expect a function argument to setTimeout to be flagged'
)

console.log('✅ All tests passed!')
