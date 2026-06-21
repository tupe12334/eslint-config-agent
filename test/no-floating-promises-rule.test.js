/**
 * Integration test for the `@typescript-eslint/no-floating-promises` rule
 * shipped by eslint-config-agent.
 *
 * A floating promise — one created but never `await`ed, returned, `void`-ed, or
 * handled with `.then`/`.catch` — runs detached: a rejection becomes an
 * unhandled rejection (process-killing under Node's default policy) and the
 * surrounding code races ahead before the work settles, so ordering and error
 * handling silently break far from the call site. It is the single most common
 * async shortcut an AI assistant emits — calling an `async` helper as a bare
 * statement and moving on — and the foundational, first side of the
 * async-hygiene triangle this config builds alongside `promise-function-async`
 * and `return-await`. The shared config must flag the unhandled call while
 * leaving an `await`ed call alone. This guards against accidental removal of the
 * rule and documents the intended behavior.
 *
 * The rule is type-aware, so the fixtures must be real on-disk files the
 * TypeScript project service can resolve (a synthetic `lintText` filePath gets
 * no type information). Run as a standalone node script by
 * scripts/test-runner.js (exit code 0 = pass).
 */
import assert from 'assert'
import { ESLint } from 'eslint'

const eslint = new ESLint({ overrideConfigFile: 'eslint.config.js' })

const floatingPromiseMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/no-floating-promises'
  )
}

console.log('Testing no-floating-promises rule from the shipped config...')

// The bare, unhandled `work()` call must be flagged.
const invalid = await floatingPromiseMessages(
  'test/no-floating-promises/invalid-no-floating-promises.ts'
)
assert.ok(
  invalid.length >= 1,
  `Expected the unhandled promise call to be flagged by no-floating-promises, got ${invalid.length}`
)
assert.strictEqual(
  invalid[0].severity,
  2,
  'no-floating-promises should be an error'
)

// The `await`ed call must pass.
const valid = await floatingPromiseMessages(
  'test/no-floating-promises/valid-no-floating-promises.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect an awaited promise call to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
