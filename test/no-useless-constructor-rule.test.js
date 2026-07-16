/**
 * Integration test for the `no-useless-constructor` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must flag an empty constructor (one whose body is
 * completely empty) and a forwarding constructor (one whose only statement
 * passes all arguments straight to `super`), and must leave a constructor
 * that contains real logic alone. This guards against accidental removal of
 * the rule and documents the intended behavior. Run as a standalone node
 * script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noUselessConstructorMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-useless-constructor-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-useless-constructor'
  )
}

console.log('Testing no-useless-constructor rule from the shipped config...')

// An empty constructor body adds nothing — the implicit constructor behaves
// identically and must be flagged.
const emptyConstructor = await noUselessConstructorMessages(
  'export class Empty {\n' + '  constructor() {}\n' + '}\n'
)
assert.ok(
  emptyConstructor.length > 0,
  'Expected an empty constructor to be flagged by no-useless-constructor'
)
assert.strictEqual(
  emptyConstructor[0].severity,
  2,
  'no-useless-constructor should be an error'
)

// A constructor that only forwards its arguments to `super` is redundant —
// JavaScript already provides this forwarding implicitly and must be flagged.
const forwardingConstructor = await noUselessConstructorMessages(
  'export class Parent {\n' +
    '  constructor(value) {\n' +
    '    this.value = value\n' +
    '  }\n' +
    '}\n' +
    'export class Child extends Parent {\n' +
    '  constructor(...args) {\n' +
    '    super(...args)\n' +
    '  }\n' +
    '}\n'
)
assert.ok(
  forwardingConstructor.length > 0,
  'Expected a forwarding constructor to be flagged by no-useless-constructor'
)

// A constructor that performs real initialization must NOT be flagged.
const meaningfulConstructor = await noUselessConstructorMessages(
  'export class WithLogic {\n' +
    '  constructor(value) {\n' +
    '    this.value = value\n' +
    '  }\n' +
    '}\n'
)
assert.strictEqual(
  meaningfulConstructor.length,
  0,
  'Did not expect a meaningful constructor to be flagged by no-useless-constructor'
)

console.log('✅ All tests passed!')
