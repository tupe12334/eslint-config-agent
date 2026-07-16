// Fixture for @typescript-eslint/no-unused-private-class-members.
//
// A `private` class field that is read elsewhere in the class body must not
// be flagged.

export class Widget {
  private id: number

  constructor(id: number) {
    this.id = id
  }

  getId(): number {
    return this.id
  }
}
