// Invalid: Record with union of literal keys

// ❌ Two literal keys
type UserInfo = Record<"name" | "age", string>;

// ❌ Multiple literal keys
type ApiConfig = Record<"host" | "port" | "ssl", string>;

// ❌ Status enumeration
type TaskStatus = Record<"pending" | "completed" | "failed", boolean>;

// ❌ Complex union
type FormData = Record<"username" | "password" | "email" | "confirmPassword", string>;

// ❌ In interface properties
interface ComponentProps {
  data: Record<"id" | "name" | "value", string>;
  metadata: Record<"created" | "updated", Date>;
}