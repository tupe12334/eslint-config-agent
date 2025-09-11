// Valid: Using specific types instead of any
export function processData(data: string[]): number {
  return data.length;
}

export const config: { apiUrl: string; timeout: number } = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
};