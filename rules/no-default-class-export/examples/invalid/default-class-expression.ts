// Invalid: Default class export (class expression)
export default class {
  private value: number = 0;

  increment(): void {
    this.value++;
  }

  getValue(): number {
    return this.value;
  }
}