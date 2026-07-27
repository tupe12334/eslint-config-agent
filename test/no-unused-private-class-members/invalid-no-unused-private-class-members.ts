// Invalid-by-design fixture for
// `@typescript-eslint/no-unused-private-class-members`.
// Exactly one violation, no other rule noise (single export):
//
// `cachedLabel` is a TypeScript `private` field that is only ever assigned
// in the constructor and never read anywhere in the class body. It is dead
// weight — either a leftover from a refactor, or a field the author meant to
// wire up and forgot to finish.

/**
 * Tracks a numeric count alongside an unused private cache field.
 */
export class Counter {
  private count: number
  private cachedLabel: string

  constructor(count: number) {
    this.count = count
    this.cachedLabel = 'unused'
  }

  getCount(): number {
    return this.count
  }
}
