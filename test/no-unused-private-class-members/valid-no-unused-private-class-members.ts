// Valid fixture for `@typescript-eslint/no-unused-private-class-members`:
// the mirror of the invalid file, except `cachedLabel` is actually read by
// `getLabel`, so the private field is genuinely used.

/**
 * Tracks a numeric count alongside a private cache field that is read back
 * through a public accessor.
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

  getLabel(): string {
    return this.cachedLabel
  }
}
