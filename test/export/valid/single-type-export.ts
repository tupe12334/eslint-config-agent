// Test: Single type export (should be valid)
type Status = 'active' | 'inactive';

export interface ValidType {
  status: Status;
  count: number;
}