/**
 * Integration test for the `@typescript-eslint/return-await` rule shipped by
 * eslint-config-agent (configured in mode `'in-try-catch'`).
 *
 * A bare `return promise` inside a `try` hands the promise back before it
 * settles, so the enclosing `try`/`catch`/`finally` has already unwound by the
 * time it rejects — the local `catch` written to handle it never fires. This is
 * the looks-guarded-but-isn't shortcut an AI assistant emits when it wraps an
 * async call in `try`/`catch` but drops the `await` on the `return`. It is the
 * third side of the async-hygiene triangle this config builds alongside
 * `no-floating-promises` and `promise-function-async`. The shared config must
 * flag the missing `await` inside `try` (and the redundant `return await`
 * outside it) while leaving a correctly awaited return and a plain bare return
 * in normal control flow alone. This guards against accidental removal of the
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

const returnAwaitMessages = async file => {
  const [result] = await eslint.lintFiles([file])
  return result.messages.filter(
    message => message.ruleId === '@typescript-eslint/return-await'
  )
}

console.log('Testing return-await rule from the shipped config...')

// The missing `await` inside `try` and the redundant `await` outside it must
// both be flagged.
const invalid = await returnAwaitMessages(
  'test/return-await/invalid-return-await.ts'
)
assert.ok(
  invalid.length >= 2,
  `Expected the bare return-in-try and the redundant return-await to both be flagged by return-await, got ${invalid.length}`
)
assert.strictEqual(invalid[0].severity, 2, 'return-await should be an error')

// A correctly awaited return inside `try` and a bare return outside it must
// both pass.
const valid = await returnAwaitMessages(
  'test/return-await/valid-return-await.ts'
)
assert.strictEqual(
  valid.length,
  0,
  `Did not expect an awaited try-return or a plain bare return to be flagged, got ${valid.length}`
)

console.log('✅ All tests passed!')
