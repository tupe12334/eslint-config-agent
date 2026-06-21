/**
 * Integration test for the `no-return-assign` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject an assignment that doubles as the value of a
 * `return` statement — both the bare `return x = y` form and the
 * parenthesised `return (x = y)` form, because the rule is configured with the
 * stricter `'always'` option. A genuine comparison (`return x === y`) and a
 * return of a previously computed value must pass. This guards against
 * accidental removal of the rule and documents the intended behavior. Run as a
 * standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const returnAssignMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'return-assign-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-return-assign'
  )
}

console.log('Testing no-return-assign rule from the shipped config...')

// A bare assignment in `return` must be flagged.
const bareAssign = await returnAssignMessages(
  'export const pick = (state, next) => {\n  return state.current = next\n}\n'
)
assert.ok(
  bareAssign.length > 0,
  'Expected `return x = y` to be flagged by the no-return-assign rule'
)
assert.strictEqual(
  bareAssign[0].severity,
  2,
  'no-return-assign should be an error'
)

// The parenthesised form must also be flagged under the `'always'` option.
const parenAssign = await returnAssignMessages(
  'export const pick = (state, next) => {\n  return (state.current = next)\n}\n'
)
assert.ok(
  parenAssign.length > 0,
  'Expected `return (x = y)` to be flagged under the no-return-assign `always` option'
)

// A real comparison must pass.
const comparison = await returnAssignMessages(
  'export const isNext = (state, next) => {\n  return state.current === next\n}\n'
)
assert.strictEqual(
  comparison.length,
  0,
  'Did not expect a `===` comparison to be flagged by the no-return-assign rule'
)

// Returning a separately computed value must pass.
const plainReturn = await returnAssignMessages(
  'export const total = items => {\n  const sum = items.length\n  return sum\n}\n'
)
assert.strictEqual(
  plainReturn.length,
  0,
  'Did not expect a plain value return to be flagged by the no-return-assign rule'
)

console.log('✅ All tests passed!')
