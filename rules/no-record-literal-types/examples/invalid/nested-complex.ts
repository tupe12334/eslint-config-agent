// Invalid: Record with literal keys in complex type structures

// ❌ Nested in generic types
type ApiResponse<T> = {
  data: T;
  meta: Record<"total" | "page" | "limit", number>;
};

// ❌ In Promise types
type AsyncResult = Promise<Record<"success" | "error", boolean>>;

// ❌ In array types
type ValidationRules = Array<Record<"field" | "rule" | "message", string>>;

// ❌ In union with other types
type DataOrError = Record<"data", unknown> | Record<"error", string>;

// ❌ Multiple violations in same structure
interface DatabaseResult {
  user: Record<"id" | "username", string>;
  session: Record<"token" | "expires", string>;
  permissions: Record<"read" | "write" | "admin", boolean>;
}