// Invalid fixture for `@typescript-eslint/no-misused-promises`.
//
// `Array.prototype.forEach` expects a callback typed `(item: T) => void`.
// An async callback is structurally assignable to that signature, so
// TypeScript's own type-checker silently accepts it — but the `Promise<void>`
// the callback returns is immediately discarded. Any rejection becomes an
// unhandled rejection; any side-effect the caller expected to be finished
// before `forEach` returns is still in flight. The rule flags exactly this
// pattern so the silent drop cannot go unnoticed.

export const processItems = (items: string[]): void => {
  items.forEach(async (item) => {
    await Promise.resolve(item)
  })
}
