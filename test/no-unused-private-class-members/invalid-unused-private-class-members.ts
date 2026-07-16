// Fixture for @typescript-eslint/no-unused-private-class-members.
//
// A `private` (TypeScript keyword) class field that is declared and never
// read anywhere in the class body must be flagged — it is dead code with no
// legitimate external caller to account for.

export class Widget {
  private unusedLabel = 'unused'

  private id: number

  constructor(id: number) {
    this.id = id
  }

  getId(): number {
    return this.id
  }
}
