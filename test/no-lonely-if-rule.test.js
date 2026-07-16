/**
 * Integration test for the `no-lonely-if` rule shipped by eslint-config-agent.
 *
 * The shared config must reject an `if` statement that is the only statement
 * inside an `else` block, requiring `else if` instead. The lone `if`-in-`else`
 * adds an indentation level that hides what is really a flat chain of
 * conditions — the same needless nesting the config's `no-else-return` rule and
 * `early-return` plugin already push back on. A flat `else if` chain, and an
 * `else` that holds extra statements alongside the `if`, must both pass. Run as
 * a standalone node script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noLonelyIfMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-lonely-if-sample.js',
  })
  return result.messages.filter(message => message.ruleId === 'no-lonely-if')
}

console.log('Testing no-lonely-if rule from the shipped config...')

// A lone `if` nested in an `else` must be flagged.
const lonely = await noLonelyIfMessages(
  `export const run = (a, b) => {
  if (a) {
    doA()
  } else {
    if (b) {
      doB()
    }
  }
}
`
)
assert.ok(lonely.length > 0, 'Expected a lone `if` inside `else` to be flagged')
assert.strictEqual(lonely[0].severity, 2, 'no-lonely-if should be an error')

// A flat `else if` chain must pass.
const chain = await noLonelyIfMessages(
  `export const run = (a, b) => {
  if (a) {
    doA()
  } else if (b) {
    doB()
  }
}
`
)
assert.strictEqual(
  chain.length,
  0,
  'Did not expect a flat `else if` chain to be flagged'
)

// An `else` that holds extra statements alongside the `if` must pass.
const withExtra = await noLonelyIfMessages(
  `export const run = (a, b) => {
  if (a) {
    doA()
  } else {
    prep()
    if (b) {
      doB()
    }
  }
}
`
)
assert.strictEqual(
  withExtra.length,
  0,
  'Did not expect an `else` with extra statements to be flagged'
)

console.log('✅ All tests passed!')
