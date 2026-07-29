# Release Guide

This document describes how to release new versions of `eslint-config-agent`.

## Prerequisites

1. **Clean Working Directory**: Ensure all changes are committed and your working directory is clean

Releases run through GitHub Actions CI/CD only — no local npm authentication is needed. Publishing uses npm's OIDC trusted publishing (`npm publish --provenance`), authenticated via the GitHub-provided `GITHUB_TOKEN` (no `NPM_TOKEN` secret involved).

## Release Process

The project uses `release-it`, triggered automatically by GitHub Actions (see `.github/workflows/ci.yml`).

### CI/CD Releases

- **Automatic**: Pushing to `main` triggers a patch release (`pnpm release:ci:patch`)
- **Manual**: Run the "CI/CD" workflow from the Actions tab (`workflow_dispatch`) and choose `patch`, `minor`, or `major`

Each run will:

1. Run validation tests (`pnpm validate` and `pnpm test:ci`)
2. Bump the version number
3. Generate a changelog based on conventional commits
4. Create a git tag
5. Commit the version bump
6. Push changes to the remote repository
7. Publish to npm

### Specific Version Releases

The workflow invokes one of these scripts depending on the chosen release type:

```bash
# Patch release (1.0.0 → 1.0.1)
pnpm release:ci:patch

# Minor release (1.0.0 → 1.1.0)
pnpm release:ci:minor

# Major release (1.0.0 → 2.0.0)
pnpm release:ci:major
```

### Dry Run

To test the release process locally without actually publishing:

```bash
pnpm exec release-it --dry-run
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

- Verify the workflow has `id-token: write` permission (required for OIDC trusted publishing)
- Verify you have publish access to the package on npm

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

1. Verify the package is available on [npmjs.com](https://npmjs.com/package/eslint-config-agent)
2. Test installation in a separate project
3. Update any dependent projects that use this configuration
4. Announce the release if significant changes were made
