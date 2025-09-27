// Invalid: Complex expressions with nullish coalescing
export function complexCalculation(a: number | null, b: number | null): number {
  // Should trigger rule: ?? in mathematical expressions
  return (a ?? 0) + (b ?? 1) * 2;
}

function getValue1(): string | null { return null; }
function getValue2(): string | null { return null; }
function getValue3(): string | null { return null; }

const timeout: number | null = null;
const retries: number | null = null;
const endpoint: string | null = null;

// Should trigger rule: ?? in object properties
const config = {
  timeout: timeout ?? 5000,
  retries: retries ?? 3,
  endpoint: endpoint ?? 'https://api.default.com',
};

// Should trigger rule: ?? in array contexts
const items = [
  getValue1() ?? 'default1',
  getValue2() ?? 'default2',
  getValue3() ?? 'default3',
];

// Should trigger rule: ?? in conditional contexts
function conditionalAssignment(condition: boolean, value: string | null): string {
  return condition ? (value ?? 'conditional-default') : 'else-branch';
}

// Should trigger rule: ?? with type assertions
function withTypeAssertion(value: unknown): string {
  return (value as string | null) ?? 'type-default';
}