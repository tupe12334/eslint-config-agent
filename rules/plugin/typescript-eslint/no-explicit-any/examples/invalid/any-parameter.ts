// Invalid: Using any type for function parameter
export function processData(data: any): number {
  return data.length;
}