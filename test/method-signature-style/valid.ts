// Property-style signatures are sound (checked contravariantly) and must pass.

export interface Handler {
  handle: (event: string) => void
  transform: (input: number) => number
}
