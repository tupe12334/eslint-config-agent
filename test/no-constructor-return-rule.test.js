/**
 * Integration test for the `no-constructor-return` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag a class constructor that returns a value —
 * whether an object (which silently overrides the instance `new` hands back)
 * or a primitive (which is ignored outright, making the `return` dead code).
 * A constructor with no `return` at all, and a constructor with a bare early
 * `return;` (no value) used to bail out, must both pass. This guards against
 * accidental removal of the rule and documents the intended behavior.
 * Run as a standalone node script by scripts/test-runner.js (exit 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

/**
 * @param code - Source code to lint as a .js file.
 * @returns Messages for no-constructor-return.
 */
const constructorReturnMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-constructor-return-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-constructor-return'
  )
}

console.log('Testing no-constructor-return rule from the shipped config...')

// A constructor returning an object must be flagged.
const objectReturn = await constructorReturnMessages(
  'export class Thing {\n  constructor() {\n    return { fake: true }\n  }\n}\n'
)
assert.ok(
  objectReturn.length > 0,
  'Expected a constructor returning an object to be flagged by no-constructor-return'
)
assert.strictEqual(
  objectReturn[0].severity,
  2,
  'no-constructor-return should be an error'
)

// A constructor returning a primitive must be flagged.
const primitiveReturn = await constructorReturnMessages(
  'export class Thing {\n  constructor() {\n    return 5\n  }\n}\n'
)
assert.ok(
  primitiveReturn.length > 0,
  'Expected a constructor returning a primitive to be flagged by no-constructor-return'
)

// A constructor with no return must NOT be flagged.
const noReturn = await constructorReturnMessages(
  'export class Thing {\n  constructor(value) {\n    this.value = value\n  }\n}\n'
)
assert.strictEqual(
  noReturn.length,
  0,
  'Did not expect a constructor with no return to be flagged by no-constructor-return'
)

// A constructor with a bare early `return;` (no value) must NOT be flagged.
const bareReturn = await constructorReturnMessages(
  'export class Thing {\n  constructor(value) {\n    if (!value) {\n      return\n    }\n    this.value = value\n  }\n}\n'
)
assert.strictEqual(
  bareReturn.length,
  0,
  'Did not expect a bare early `return;` in a constructor to be flagged by no-constructor-return'
)

console.log('✅ All tests passed!')
