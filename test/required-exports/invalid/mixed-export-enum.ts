// Test: Mixed exported and non-exported enums (should trigger error for non-exported)

export enum ExportedEnum {
  VALUE_A = "A",
  VALUE_B = "B"
}

enum NonExportedEnum {
  VALUE_X = "X",
  VALUE_Y = "Y"
}