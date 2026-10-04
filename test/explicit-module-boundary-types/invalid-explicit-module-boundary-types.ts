// Fixture for @typescript-eslint/explicit-module-boundary-types.
//
// An exported function with an inferred return type is a module boundary
// left implicit and must be flagged.

export const shout = (text: string) => text.toUpperCase()
