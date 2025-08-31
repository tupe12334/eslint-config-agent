// Test: Single const assertion export (should be valid)
export const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3
} as const;