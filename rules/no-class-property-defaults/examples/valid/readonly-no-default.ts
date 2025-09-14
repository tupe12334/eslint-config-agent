/**
 * Valid: Readonly property without default value
 */

export class Entity {
  readonly id: string; // ✅ Valid: Readonly property without default

  constructor(id: string) {
    this.id = id;
  }
}