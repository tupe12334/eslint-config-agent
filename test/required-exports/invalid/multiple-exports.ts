// Test: Multiple exported classes and enums (should be invalid - multiple export statements not allowed)

export class FirstClass {
  method(): void {}
}

export class SecondClass {
  method(): void {}
}

export enum Status {
  PENDING = "pending",
  COMPLETE = "complete"
}

export enum Priority {
  LOW = 1,
  HIGH = 2
}