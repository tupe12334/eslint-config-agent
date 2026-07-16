// Fixture for @typescript-eslint/no-mixed-enums.
//
// An enum that mixes numeric and string member values must be flagged.
// The combined type widens in surprising ways: no reverse-mapping for string
// members, Object.values() returns a heterogeneous array, and exhaustiveness
// behaviour varies across TypeScript versions.

export enum Status {
  Active = 0,
  // eslint-disable-next-line @typescript-eslint/prefer-enum-initializers -- intentional numeric member to form the invalid mix
  Inactive,
  Name = 'status',
}
