// Valid: Using logical OR (||) operator for falsy checks
export function getDefaultValue(value: string): string {
  // Valid: logical OR operator (different from nullish coalescing)
  return value || 'default';
}

function processConfig(config: { timeout?: number }): number {
  // Valid: logical OR for falsy values (includes 0, '', false, etc.)
  return config.timeout || 5000;
}

function handleEmptyStrings(input: string): string {
  // Valid: logical OR handles empty strings appropriately
  return input || 'no input provided';
}

// Valid: logical OR with function calls
function getData(): string {
  return fetchFromCache() || fetchFromAPI() || 'no-data';
}

function fetchFromCache(): string { return ''; }
function fetchFromAPI(): string { return ''; }

// Valid: logical OR in expressions (without process.env)
const portString: string | undefined = undefined;
const hostString: string | undefined = undefined;
const port = portString || '3000';
const host = hostString || 'localhost';