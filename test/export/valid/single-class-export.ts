// Test: Single class export (should be valid)
export class ValidClass {
  constructor(public value: string) {}

  getValue() {
    return this.value;
  }
}