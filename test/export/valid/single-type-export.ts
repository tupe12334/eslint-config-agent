// Test: Single type export (should be valid)
type Status = 'active' | 'inactive';

export type ValidType = {
  status: Status;
  count: number;
};