// Fixture for @typescript-eslint/prefer-readonly.
//
// `id` and `#count` are private, assigned once in the constructor, and never
// reassigned anywhere else — they should be declared `readonly`. The rule must
// flag both so the shared config catches "set once but left mutable" fields.
// The members are read without any string coercion so this fixture isolates the
// prefer-readonly signal (no template-expression or other rule noise).

export class InvalidStore {
  private id: string
  #count: number

  public constructor(id: string, count: number) {
    this.id = id
    this.#count = count
  }

  public getId(): string {
    return this.id
  }

  public getCount(): number {
    return this.#count
  }
}
