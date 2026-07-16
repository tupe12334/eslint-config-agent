// Invalid fixture for `no-useless-call`.
//
// `.call(null, ...)` with a null receiver behaves identically to a direct
// call — the `this` rebinding is a no-op — so the wrapper is pure overhead
// that misleads readers into thinking the receiver matters when it does not.

const greet = (name: string): string => `Hello, ${name}`

export const runGreetings = (): string => greet.call(null, 'Alice')
