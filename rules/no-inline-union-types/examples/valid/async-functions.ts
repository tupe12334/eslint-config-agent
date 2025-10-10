// Valid: Async functions using named union types

type DataFormat = 'json' | 'xml' | 'csv';

// ✅ Async function with named type
export async function fetchData(format: DataFormat) {
  return format;
}
