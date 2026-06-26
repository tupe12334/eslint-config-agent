// Fixture for testing that the process.env guard is kept in the recommended preset.
// `process.env.NODE_ENV` triggers no-restricted-syntax / no-process-env-properties;
// the recommended preset relaxes the opinionated rules but must keep this check.
export function getMode(): string {
  return process.env.NODE_ENV ?? 'development'
}
