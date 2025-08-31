// Test: Multiple non-exported classes and enums (should trigger multiple errors)

class FirstNonExportedClass {
  method(): void {}
}

class SecondNonExportedClass {
  method(): void {}
}

enum FirstNonExportedEnum {
  OPTION_1 = 1,
  OPTION_2 = 2
}

enum SecondNonExportedEnum {
  TYPE_A = "A",
  TYPE_B = "B"
}