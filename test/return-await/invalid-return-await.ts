// Invalid-by-design fixture for `@typescript-eslint/return-await`
// (mode `'in-try-catch'`). Exactly two return-await violations, no other
// rule noise (single export; the helper awaits so `require-await` is satisfied):
//
// 1. The `return await work()` in plain control flow (outside any `try`) is
//    redundant — the `await` changes nothing there — so the rule must flag it.
// 2. The bare `return work()` inside the `try` hands the promise back before it
//    settles, so the surrounding `catch` can never see a rejection — the rule
//    must require `return await` here.

const work = async (): Promise<string> => {
  await Promise.resolve()
  return 'done'
}

export const handleInvalid = async (useFastPath: boolean): Promise<string> => {
  if (useFastPath) {
    return await work()
  }

  try {
    return work()
  } catch {
    return 'recovered'
  }
}
