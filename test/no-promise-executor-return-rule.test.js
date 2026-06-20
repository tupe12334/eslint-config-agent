/**
 * Integration test for the `no-promise-executor-return` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject returning a value from a `Promise` executor —
 * the function passed to `new Promise(...)` — because the constructor discards
 * that value, so the work it represents runs unobserved. A block-body executor
 * that resolves/rejects without returning must pass. This guards against
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

const noPromiseExecutorReturnMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-promise-executor-return-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-promise-executor-return'
  )
}

console.log(
  'Testing no-promise-executor-return rule from the shipped config...'
)

// An explicit `return` of a value from the executor must be flagged.
const explicitReturn = await noPromiseExecutorReturnMessages(
  'export const wait = () =>\n' +
    '  new Promise((resolve) => {\n' +
    '    return resolve(1)\n' +
    '  })\n'
)
assert.ok(
  explicitReturn.length > 0,
  'Expected a returned value from the Promise executor to be flagged'
)
assert.strictEqual(
  explicitReturn[0].severity,
  2,
  'no-promise-executor-return should be an error'
)

// A concise arrow body that returns the executor value must also be flagged.
const conciseReturn = await noPromiseExecutorReturnMessages(
  'export const wait = () => new Promise((resolve) => resolve(1))\n'
)
assert.ok(
  conciseReturn.length > 0,
  'Expected a concise-body Promise executor return to be flagged'
)

// A block-body executor that resolves without returning must pass.
const blockBody = await noPromiseExecutorReturnMessages(
  'export const wait = () =>\n' +
    '  new Promise((resolve) => {\n' +
    '    resolve(1)\n' +
    '  })\n'
)
assert.strictEqual(
  blockBody.length,
  0,
  'Did not expect a non-returning Promise executor to be flagged'
)

console.log('✅ All tests passed!')
