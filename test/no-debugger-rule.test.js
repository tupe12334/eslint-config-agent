/**
 * Integration test for the `no-debugger` rule shipped by eslint-config-agent.
 *
 * The shared config must reject a leftover `debugger` statement in source — a
 * pure debugging artifact that is otherwise a no-op and should never reach a
 * commit — while leaving ordinary code (including an unrelated `debugger`
 * identifier such as a property name) untouched. This guards against accidental
 * removal of the rule. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const debuggerMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'debugger-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-debugger')
}

console.log('Testing no-debugger rule from the shipped config...')

// A bare `debugger` statement must be flagged.
const stmt = await debuggerMessages(
  'export const compute = value => {\n  debugger\n  return value\n}\n'
)
assert.ok(
  stmt.length > 0,
  'Expected a `debugger` statement to be flagged by the no-debugger rule'
)
assert.strictEqual(stmt[0].severity, 2, 'no-debugger should be an error')

// `debugger` as an ordinary property name is not the statement and must stay quiet.
const propertyName = await debuggerMessages(
  'export const flags = { debugger: false }\nexport const on = flags.debugger\n'
)
assert.strictEqual(
  propertyName.length,
  0,
  'Did not expect a `debugger` property name to be flagged by the no-debugger rule'
)

console.log('✅ All tests passed!')
