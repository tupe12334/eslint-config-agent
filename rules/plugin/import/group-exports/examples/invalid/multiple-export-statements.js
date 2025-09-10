// Invalid: Multiple separate export statements should be consolidated
const apiUrl = "https://api.example.com";
const timeout = 5000;
const retries = 3;

export { apiUrl };
export { timeout };
export { retries };