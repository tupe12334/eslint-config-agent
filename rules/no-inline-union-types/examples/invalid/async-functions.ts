// Invalid: Async function parameters with inline union types

// ❌ Async function with inline union
export async function fetchData(format: 'json' | 'xml' | 'csv') {
  return format;
}
