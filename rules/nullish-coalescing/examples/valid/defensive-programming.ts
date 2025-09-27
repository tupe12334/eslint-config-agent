// Valid: Defensive programming patterns without nullish coalescing
export function safeStringAccess(obj: { value?: string }): string {
  // Valid: explicit property existence check
  if ('value' in obj && obj.value !== null && obj.value !== undefined) {
    return obj.value;
  }
  return 'default';
}

export function safeArrayAccess<T>(arr: T[] | null | undefined, index: number): T | null {
  // Valid: explicit array and bounds checking
  if (arr !== null && arr !== undefined && index >= 0 && index < arr.length) {
    return arr[index];
  }
  return null;
}

// Valid: using helper functions for null checks
export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

export function processWithHelper(input: string | null | undefined): string {
  // Valid: using helper function for clarity
  if (isNullOrUndefined(input)) {
    return 'default';
  }
  return input;
}

// Valid: configuration objects with explicit defaults
export function createConfig(overrides: Partial<Config> = {}): Config {
  const defaults: Config = {
    timeout: 5000,
    retries: 3,
    endpoint: 'https://api.default.com',
  };

  return {
    timeout: overrides.timeout !== undefined ? overrides.timeout : defaults.timeout,
    retries: overrides.retries !== undefined ? overrides.retries : defaults.retries,
    endpoint: overrides.endpoint !== undefined ? overrides.endpoint : defaults.endpoint,
  };
}

interface Config {
  timeout: number;
  retries: number;
  endpoint: string;
}