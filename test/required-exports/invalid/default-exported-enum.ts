// Test: Default exported enum (should be invalid - default export of enums not allowed)

enum Status {
  PENDING = "pending",
  COMPLETE = "complete"
}

export default Status;