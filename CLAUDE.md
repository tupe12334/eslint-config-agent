# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESLint configuration package (`eslint-config-agent`) that provides TypeScript and JavaScript linting rules. The package exports a reusable ESLint configuration that can be consumed by other projects.

## Development Setup

The project uses pnpm as the package manager. Dependencies are already installed.

## Common Commands

### Development & Testing

- `pnpm lint` - Run ESLint on the entire project
- `pnpm test` - Run comprehensive test suite with categorized validation
- `pnpm test:valid` - Test valid code samples
- `pnpm test:invalid` - Test invalid code samples that should trigger errors
- `pnpm test:hooks` - Test React hooks rules
- `pnpm test:imports` - Test import/export patterns
- `pnpm test:edge` - Test edge cases and boundary conditions
- `pnpm test:performance` - Test large files and complex scenarios
- `pnpm test:ci` - Run ESLint with zero warnings allowed (used for CI)
- `pnpm validate` - Run legacy configuration validation
- `pnpm lint:test` - Run ESLint specifically on test files

**Note**: The test suite uses `scripts/test-runner.js` which categorizes test files and validates expected error/warning counts for each category.

### Release Management

- `pnpm release` - Interactive release process (recommended)
- `pnpm release:patch` - Patch version release (1.0.0 → 1.0.1)
- `pnpm release:minor` - Minor version release (1.0.0 → 1.1.0)
- `pnpm release:major` - Major version release (1.0.0 → 2.0.0)
- `pnpm release:dry` - Test release process without publishing

## Architecture

The project follows the modern ESLint flat configuration format:

- `index.js` - Main configuration export that other projects will consume
- `eslint.config.js` - Local ESLint configuration for this project itself
- `test/` - Test files that validate the ESLint rules are working correctly
- `scripts/validate-config.js` - Validation script that tests the configuration

The main export provides separate configurations for:

- TypeScript/TSX files with React/Preact support
- JavaScript/JSX files with React/Preact support
- Node.js scripts with appropriate globals

## Testing

You must test any changes to the ESLint configuration. Run `pnpm test` for comprehensive testing or `pnpm validate` for basic validation.

## Release Process

This package uses `release-it` with automated version management and changelog generation.

### Local Releases

Before any local release:

1. Copy `.env.example` to `.env` and add your NPM_TOKEN
2. Ensure all tests pass: `pnpm test:ci` and `pnpm validate`
3. Working directory must be clean (all changes committed)
4. Use conventional commit messages for better changelog generation

### CI Releases

The project includes GitHub Actions for automated releases:

- **Automatic**: Push to main branch triggers a patch release
- **Manual**: Use "Actions" > "Release" workflow with choice of patch/minor/major
- **Requirements**: NPM_TOKEN secret must be configured in GitHub repository settings

Required GitHub Secrets:

- `NPM_TOKEN`: Token from npmjs.com for publishing packages
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

The release process automatically handles version bumping, changelog generation, git tagging, npm publishing, and GitHub releases.
