/**
 * Valid: Class property initialized through method
 */

export class Counter {
  value: number;

  constructor() {
    this.reset(); // ✅ Valid: Property initialized through method call
  }

  reset(): void {
    this.value = 0;
  }
}