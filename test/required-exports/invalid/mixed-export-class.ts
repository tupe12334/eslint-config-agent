// Test: Mixed exported and non-exported classes (should trigger error for non-exported)

export class ExportedClass {
  method(): void {}
}

class NonExportedClass {
  method(): void {}
}