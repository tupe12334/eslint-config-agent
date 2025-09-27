// Invalid: Basic nullish coalescing operator usage
export function getUserName(user: { name?: string }): string {
  // Should trigger rule: using ?? operator
  return user.name ?? 'Anonymous';
}

function getValue(): string | null {
  return null;
}

const fallbackValue = 'fallback';

// Should trigger rule: using ?? operator
const result = getValue() ?? fallbackValue;