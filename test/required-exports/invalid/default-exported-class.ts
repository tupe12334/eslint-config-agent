// Test: Default exported class (should be invalid - default export of classes not allowed)

export default class DefaultExportedClass {
  private readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }
}