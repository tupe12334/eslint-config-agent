// Valid fixture for `@typescript-eslint/no-floating-promises`. The mirror of
// the invalid file: the same promise-returning `work()` is `await`ed, so the
// promise is handled and the rule must not fire. Single export; the helper
// awaits so no other rule fires either.

const work = async (): Promise<string> => {
  await Promise.resolve()
  return 'done'
}

export const handleValid = async (): Promise<void> => {
  await work()
}
