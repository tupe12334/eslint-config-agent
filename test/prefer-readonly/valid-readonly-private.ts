// Fixture for @typescript-eslint/prefer-readonly.
//
// `id` is already `readonly`, and `count` is genuinely reassigned by a method,
// so neither should be flagged. A public field (`label`) is outside the rule's
// scope and must also pass. This proves the rule only fires on the
// "set-once-but-mutable private" case and carries near-zero false-positive cost.

export class ValidStore {
  private readonly id: string
  private count: number
  public label: string

  public constructor(id: string, label: string) {
    this.id = id
    this.count = 0
    this.label = label
  }

  public increment(): void {
    this.count += 1
  }

  public getId(): string {
    return this.id
  }

  public getCount(): number {
    return this.count
  }
}
