/**
 * Integration test for the `no-await-in-loop` rule shipped by
 * eslint-config-agent.
 *
 * An `await` inside a loop body serializes iterations that could otherwise run
 * concurrently: the loop pays the *sum* of every promise's latency instead of
 * the *max*, turning a batch of independent network/DB calls into an N-times
 * slower stall. It is the throughput side of the async-hygiene family this
 * config builds with `no-floating-promises`, `promise-function-async` and
 * `return-await`, and exactly the shape an AI assistant emits when it drops an
 * `await` into a `for` loop instead of reaching for `Promise.all` over a
 * `.map`. The shared config must flag the awaited loop while leaving the
 * concurrent `Promise.all` form alone. This guards against accidental removal
 * of the rule and documents the intended behavior. Run as a standalone node
 * script by scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const noAwaitInLoopMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'no-await-in-loop-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-await-in-loop'
  )
}

console.log('Testing no-await-in-loop rule from the shipped config...')

// An `await` inside a `for-of` loop body must be flagged: the iterations are
// serialized when they could run concurrently.
const serial = await noAwaitInLoopMessages(
  `export const run = async items => {
  const out = []
  for (const item of items) {
    out.push(await fetchOne(item))
  }
  return out
}
`
)
assert.ok(
  serial.length > 0,
  'Expected an `await` inside a loop body to be flagged'
)
assert.strictEqual(serial[0].severity, 2, 'no-await-in-loop should be an error')

// Running the independent work concurrently with `Promise.all` over a `.map`
// (no `await` in any loop body) must pass.
const concurrent = await noAwaitInLoopMessages(
  `export const run = async items => {
  return Promise.all(items.map(item => fetchOne(item)))
}
`
)
assert.strictEqual(
  concurrent.length,
  0,
  'Did not expect a concurrent `Promise.all` form to be flagged'
)

console.log('✅ All tests passed!')
