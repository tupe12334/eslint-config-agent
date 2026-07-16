// Valid fixture for `@typescript-eslint/return-await` (mode `'in-try-catch'`).
// The mirror of the invalid file: a bare `return` in plain control flow (where
// awaiting would be redundant) and an awaited `return await` inside the `try`
// (so the rejection stays inside the protected scope and the `catch` fires).
// Neither return may be flagged. Single export; the helper awaits so no other
// rule fires either.

const work = async (): Promise<string> => {
  await Promise.resolve()
  return 'done'
}

export const handleValid = async (useFastPath: boolean): Promise<string> => {
  if (useFastPath) {
    return work()
  }

  try {
    return await work()
  } catch {
    return 'recovered'
  }
}
