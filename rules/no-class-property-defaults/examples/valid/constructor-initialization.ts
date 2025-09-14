/**
 * Valid: Class property initialized in constructor
 */

export class User {
  name: string;

  constructor(name: string = 'default') {
    this.name = name; // ✅ Valid: Property initialized in constructor
  }
}