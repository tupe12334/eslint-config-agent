/**
 * Integration test for the `no-constant-binary-expression` rule shipped by
 * eslint-config-agent.
 *
 * The shared config must reject a binary/logical expression whose result is
 * provably constant regardless of a variable operand — a `&&`/`||` with a
 * statically known boolean on the left (`true || sideEffect()`), a loose
 * equality against `null`/`undefined` that can never be false (`null ==
 * undefined`), and a `===` comparison between two freshly constructed
 * objects (`new Error() === new Error()`) — since each of these type-checks
 * and runs without error while hiding a condition that can never be
 * anything but constant. A real, data-dependent comparison must still pass.
 * This guards against accidental removal of the rule and documents the
 * intended behavior. Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'node:assert'
import { ESLint } from 'eslint'
import config from '../index.js'

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: config,
})

const constantBinaryMessages = async code => {
  const [result] = await eslint.lintText(code, {
    filePath: 'constant-binary-expression-sample.js',
  })
  return result.messages.filter(
    message => message.ruleId === 'no-constant-binary-expression'
  )
}

console.log(
  'Testing no-constant-binary-expression rule from the shipped config...'
)

// A statically-known-truthy left operand of `||` must be flagged: the right
// side (and any side effect in it) never runs.
const alwaysTruthyOr = await constantBinaryMessages(
  `export function isReady(sideEffect) {
  return true || sideEffect()
}
`
)
assert.ok(
  alwaysTruthyOr.length > 0,
  'Expected `true || sideEffect()` to be flagged as a constant short circuit'
)
assert.strictEqual(
  alwaysTruthyOr[0].severity,
  2,
  'no-constant-binary-expression should be an error'
)

// A statically-known-falsy left operand of `&&` must be flagged the same way.
const alwaysFalsyAnd = await constantBinaryMessages(
  `export function isReady(sideEffect) {
  return false && sideEffect()
}
`
)
assert.ok(
  alwaysFalsyAnd.length > 0,
  'Expected `false && sideEffect()` to be flagged as a constant short circuit'
)

// `null == undefined` is always true under loose equality.
const nullLooseEqualsUndefined = await constantBinaryMessages(
  `export function isNullish() {
  return null == undefined
}
`
)
assert.ok(
  nullLooseEqualsUndefined.length > 0,
  'Expected `null == undefined` to be flagged as always true'
)

// Two freshly constructed objects can never be `===`-equal.
const alwaysNewComparison = await constantBinaryMessages(
  `export function neverEqual() {
  return new Error('a') === new Error('b')
}
`
)
assert.ok(
  alwaysNewComparison.length > 0,
  'Expected comparing two `new` expressions to be flagged as always false'
)

// A real, data-dependent comparison is unaffected.
const genuineComparison = await constantBinaryMessages(
  `export function isPositive(foo) {
  return foo > 0 && foo < 100
}
`
)
assert.strictEqual(
  genuineComparison.length,
  0,
  'Did not expect a genuine data-dependent comparison to be flagged'
)

console.log('no-constant-binary-expression rule test passed.')
