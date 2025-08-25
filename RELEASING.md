# Release Guide

This document describes how to release new versions of `@tupe12334/eslint-config`.

## Prerequisites

1. **NPM Access**: Ensure you have publish access to the `@tupe12334/eslint-config` package on npm
2. **Authentication**: Configure your npm authentication token in `.npmrc`:
   ```
   //registry.npmjs.org/:_authToken=your-token-here
   ```
3. **Clean Working Directory**: Ensure all changes are committed and your working directory is clean

## Release Process

The project uses `release-it` for automated releases with manual control at each step.

### Interactive Release (Recommended)

```bash
pnpm release
```

This will:
1. Run validation tests (`pnpm validate` and `pnpm test:ci`)
2. Prompt you to select the version bump (patch, minor, major, or custom)
3. Generate a changelog based on conventional commits
4. Create a git tag
5. Commit the version bump
6. Push changes to the remote repository
7. Publish to npm

### Specific Version Releases

For specific version types:

```bash
# Patch release (1.0.0 → 1.0.1)
pnpm release:patch

# Minor release (1.0.0 → 1.1.0)
pnpm release:minor

# Major release (1.0.0 → 2.0.0)
pnpm release:major
```

### Dry Run

To test the release process without actually publishing:

```bash
pnpm release:dry
```

## Pre-Release Checklist

Before running a release, ensure:

- [ ] All tests pass (`pnpm test:ci`)
- [ ] Configuration validation passes (`pnpm validate`)
- [ ] CHANGELOG.md is up to date (will be auto-generated)
- [ ] Working directory is clean
- [ ] You're on the correct branch (usually `main`)
- [ ] All intended changes are committed

## Version Strategy

This package follows [Semantic Versioning (SemVer)](https://semver.org/):

- **Patch** (1.0.x): Bug fixes and backwards-compatible changes
- **Minor** (1.x.0): New features that are backwards-compatible
- **Major** (x.0.0): Breaking changes

## Commit Message Format

For better changelog generation, use conventional commit messages:

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Maintenance tasks
```

Examples:
- `feat: add support for new ESLint rule`
- `fix: resolve TypeScript configuration conflict`
- `docs: update installation instructions`

## Troubleshooting

### Authentication Issues
- Ensure your `.npmrc` file contains a valid authentication token
- Verify you have publish access to the package

### Test Failures
- All tests must pass before release
- Run `pnpm validate` and `pnpm test:ci` to identify issues

### Git Issues
- Ensure your working directory is clean
- Make sure you're on the correct branch
- Verify remote repository access

### Publishing Issues
- Check network connectivity
- Verify npm registry access
- Ensure package name is not already taken (for major versions)

## Post-Release

After a successful release:

1. Verify the package is available on [npmjs.com](https://npmjs.com/package/@tupe12334/eslint-config)
2. Test installation in a separate project
3. Update any dependent projects that use this configuration
4. Announce the release if significant changes were made