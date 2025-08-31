// Test: Exported class (should be valid)

export class ValidExportedClass {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}