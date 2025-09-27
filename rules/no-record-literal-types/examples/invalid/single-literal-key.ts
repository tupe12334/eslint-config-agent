// Invalid: Record with single literal key

// ❌ Single string literal key
type UserName = Record<"name", string>;

// ❌ Single boolean key
const isActive: Record<"active", boolean> = { active: true };

// ❌ Single numeric literal key
type Count = Record<"count", number>;

// ❌ In function parameters
function processData(data: Record<"value", unknown>) {
  return data.value;
}

// ❌ In return types
function getStatus(): Record<"status", string> {
  return { status: "ok" };
}