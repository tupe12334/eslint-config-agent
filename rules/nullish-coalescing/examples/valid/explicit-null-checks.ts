// Valid: Explicit null/undefined checks instead of nullish coalescing
export function getUserName(user: { name?: string }): string {
  // Valid: explicit undefined check with ternary
  return user.name !== undefined ? user.name : 'Anonymous';
}

function getConfigValue(value: string | null | undefined): string {
  // Valid: explicit null and undefined checks
  return value !== null && value !== undefined ? value : 'default';
}

function handleNullValue(input: string | null): string {
  // Valid: explicit null check
  return input !== null ? input : 'fallback';
}

function handleUndefinedValue(input: string | undefined): string {
  // Valid: explicit undefined check
  return input !== undefined ? input : 'fallback';
}

// Valid: using if statements for clarity
function processValue(value: string | null | undefined): string {
  if (value !== null && value !== undefined) {
    return value;
  }
  return 'default';
}