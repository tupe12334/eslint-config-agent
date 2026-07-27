// Invalid-by-design fixture for `@typescript-eslint/no-floating-promises`.
// Exactly one violation, no other rule noise (single export; the helper awaits
// so no `require-await`-style concern, and the call is a plain statement):
//
// Calling the promise-returning `work()` as a bare statement creates a floating
// promise — it is never `await`ed, returned, `void`-ed, or given a
// `.then`/`.catch`. The async work runs detached, so a rejection becomes an
// unhandled rejection and the surrounding code races ahead before it settles.
// The rule must flag the unhandled call. The caller is intentionally synchronous
// so the only violation is the floating promise (an `async` caller with no
// `await` would additionally trip `require-await`).

const work = async (): Promise<string> => {
  await Promise.resolve()
  return 'done'
}

export const handleInvalid = (): void => {
  work()
}
