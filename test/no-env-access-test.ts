// Test file to demonstrate the no-env-access custom rule
// This file should trigger errors for direct env property access

// ❌ These should trigger the new custom rule
const nodeEnv = env.NODE_ENV;
const apiUrl = env.API_URL;
const port = env.PORT;

// ✅ These should be allowed
const config = getEnvironmentConfig();
const allowedNodeEnv = config.NODE_ENV;
const env_setting = 'production';
const settings = { env: 'development' };

export { allowedNodeEnv };