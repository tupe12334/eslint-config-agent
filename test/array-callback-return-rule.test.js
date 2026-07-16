/**
 * Integration test for the `array-callback-return` rule shipped by
 * eslint-config-agent.
 *
 * An array-method callback (`map`, `filter`, `reduce`, ...) that falls off the
 * end returns `undefined`, so the surrounding call silently produces the wrong
 * result — an array of `undefined` from `map`, every element kept by `filter`.
 * This is a correctness bug that type checking does not catch and that AI
 * assistants emit when they reach for a brace body and forget the `return`.
 * The shared config must flag those callbacks (and, with `checkForEach: true`,
 * the inverse mistake of returning a value from `forEach`) while still
 * accepting callbacks that return properly. This guards against accidental
 * removal of the rule and documents the intended behavior. Run as a standalone
 * node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const arrayCallbackMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'array-callback-return-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'array-callback-return'
  )
}

console.log('Testing array-callback-return rule from the shipped config...')

// A `map` callback with a brace body that forgets to return must be flagged.
const missingReturn = await arrayCallbackMessages(
  'export const labels = (items) => {\n' +
    '  return items.map((item) => {\n' +
    '    item.label\n' +
    '  })\n' +
    '}\n'
)
assert.ok(
  missingReturn.length > 0,
  'Expected a map callback with no return to be flagged by array-callback-return'
)
assert.strictEqual(
  missingReturn[0].severity,
  2,
  'array-callback-return should be an error'
)

// Returning a value from `forEach` must be flagged (checkForEach: true).
const forEachReturn = await arrayCallbackMessages(
  'export const sideEffects = (items) => {\n' +
    '  items.forEach((item) => {\n' +
    '    return item.id\n' +
    '  })\n' +
    '}\n'
)
assert.ok(
  forEachReturn.length > 0,
  'Expected returning a value from forEach to be flagged by array-callback-return'
)

// A callback that returns a value on every path must pass.
const valid = await arrayCallbackMessages(
  'export const labels = (items) => {\n' +
    '  return items.map((item) => {\n' +
    '    return item.label\n' +
    '  })\n' +
    '}\n'
)
assert.strictEqual(
  valid.length,
  0,
  'Did not expect a map callback that returns a value to be flagged'
)

console.log('✅ All tests passed!')
