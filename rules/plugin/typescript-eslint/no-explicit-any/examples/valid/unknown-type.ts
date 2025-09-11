// Valid: Using unknown instead of any for safer type handling
export function parseJson(json: string): unknown {
  return JSON.parse(json);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}