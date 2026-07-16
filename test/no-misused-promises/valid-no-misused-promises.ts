// Valid fixture for `@typescript-eslint/no-misused-promises`.
//
// Replace the async forEach with a `for...of` loop so each Promise is
// explicitly awaited. The caller receives full back-pressure — every item is
// processed before the function resolves — and any rejection propagates
// through the normal async-error path rather than becoming an unhandled
// rejection.

export const processItems = async (items: string[]): Promise<void> => {
  for (const item of items) {
    await Promise.resolve(item)
  }
}
