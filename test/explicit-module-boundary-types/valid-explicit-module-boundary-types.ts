// Fixture for @typescript-eslint/explicit-module-boundary-types.
//
// An exported function with an explicit return type, and a non-exported
// (internal) helper with an inferred return type, must not be flagged.

export const shout = (text: string): string => text.toUpperCase()

const whisper = (text: string) => text.toLowerCase()

export const echo = (text: string): string => whisper(text)
