// Test file to demonstrate the n/no-process-env rule
// This file should trigger errors for process.env usage

// ❌ These should trigger the n/no-process-env rule
const nodeEnv = process.env.NODE_ENV;
const apiUrl = process.env.API_URL;
const port = process.env.PORT;

// ✅ These should be allowed
const config = getEnvironmentConfig();
const allowedNodeEnv = config.NODE_ENV;
const env_setting = 'production';
const settings = { env: 'development' };

export { allowedNodeEnv };