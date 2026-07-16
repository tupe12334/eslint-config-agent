// Valid fixture for `no-useless-call`.
//
// A direct call is the correct form when no `this` rebinding is needed.
// Dropping the `.call(null, ...)` wrapper makes the intent explicit.

const greet = (name: string): string => `Hello, ${name}`

export const runGreetings = (): string => greet('Alice')
