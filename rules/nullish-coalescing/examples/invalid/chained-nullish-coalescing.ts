// Invalid: Chained nullish coalescing operators
export function processMultipleValues(a: string | null, b: string | null, c: string | null): string {
  // Should trigger rule: multiple ?? operators in sequence
  return a ?? b ?? c ?? 'final-fallback';
}

interface Response {
  user?: {
    profile?: {
      name?: string;
    };
    email?: string;
  };
  id?: string;
}

function getResponse(): Response {
  return {};
}

// Should trigger rule: complex chained expression (without optional chaining)
const response = getResponse();
const name = response.user && response.user.profile && response.user.profile.name;
const email = response.user && response.user.email;
const complexChain = name ?? email ?? response.id ?? 'unknown';