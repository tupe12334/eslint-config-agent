/**
 * Integration test for the `no-constructor-return` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject `return <value>` inside a class constructor
 * (which silently overrides the constructed instance or is dead code) and
 * accept both a constructor with no return and a bare early `return;`. This
 * guards against accidental removal of the rule and documents the intended
 * behavior. Run as a standalone node script by scripts/test-runner.js
 * (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noConstructorReturnMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-constructor-return-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-constructor-return'
  )
}

console.log('Testing no-constructor-return rule from the shipped config...')

// Returning an object from a constructor must be flagged.
const returnObject = await noConstructorReturnMessages(
  'export class Thing {\n' +
    '  constructor() {\n' +
    '    return { hijacked: true }\n' +
    '  }\n' +
    '}\n'
)
assert.ok(
  returnObject.length > 0,
  'Expected returning an object from a constructor to be flagged by no-constructor-return'
)
assert.strictEqual(
  returnObject[0].severity,
  2,
  'no-constructor-return should be an error'
)

// Returning a primitive from a constructor (dead code) must also be flagged.
const returnPrimitive = await noConstructorReturnMessages(
  'export class Counter {\n' +
    '  constructor() {\n' +
    '    this.value = 0\n' +
    '    return 42\n' +
    '  }\n' +
    '}\n'
)
assert.ok(
  returnPrimitive.length > 0,
  'Expected returning a primitive from a constructor to be flagged by no-constructor-return'
)

// A constructor that only initializes `this` must pass.
const noReturn = await noConstructorReturnMessages(
  'export class Counter {\n' +
    '  constructor() {\n' +
    '    this.value = 0\n' +
    '  }\n' +
    '}\n'
)
assert.strictEqual(
  noReturn.length,
  0,
  'Did not expect a constructor without a returned value to be flagged by no-constructor-return'
)

// A bare early `return;` (no value) is allowed and must pass.
const bareReturn = await noConstructorReturnMessages(
  'export class Guarded {\n' +
    '  constructor(enabled) {\n' +
    '    if (!enabled) {\n' +
    '      return\n' +
    '    }\n' +
    '    this.enabled = enabled\n' +
    '  }\n' +
    '}\n'
)
assert.strictEqual(
  bareReturn.length,
  0,
  'Did not expect a bare early `return;` in a constructor to be flagged by no-constructor-return'
)

console.log('✅ All tests passed!')
