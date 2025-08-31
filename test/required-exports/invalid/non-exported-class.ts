// Test: Non-exported class (should trigger error)

class NonExportedClass {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}