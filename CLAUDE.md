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

Key features:
- Disallows optional chaining (`?.`) and nullish coalescing (`??`)
- Enforces JSX only in `.tsx`/`.jsx` files
- Limits function length to 100 lines
- Warns about trailing spaces
- Supports both React and Preact

## Testing

The package includes extensive testing infrastructure with 12+ test files covering different scenarios:

**Test Categories:**
- **Valid Code**: Files that should pass with minimal warnings
- **Invalid Code**: Files that intentionally trigger specific errors  
- **React Hooks**: Tests for hooks rules (exhaustive-deps, rules-of-hooks)
- **Import/Export**: Tests for module patterns and import rules
- **Edge Cases**: Boundary conditions and complex JSX structures
- **Performance**: Large files and complex components for performance testing

**Test Tools:**
- `scripts/test-runner.js` - Main test runner with categorized validation and statistics
- `scripts/validate-config.js` - Legacy validator for basic functionality checks

**Key Rules Tested:**
- Nullish coalescing operator (`??`) restriction
- Optional chaining (`?.`) restriction  
- JSX filename extension enforcement
- Function length limits
- Trailing spaces detection
- React hooks dependency validation
- Conditional hook usage detection
- TypeScript type assertion rules (`no-explicit-any`, consistent type assertions)
- Record type restrictions with string literal keys
- Union type validation

Run `pnpm test` for comprehensive testing or `pnpm validate` for basic validation.

## Release Process

This package uses `release-it` with automated version management and changelog generation. Before any release:

1. Ensure all tests pass: `pnpm test:ci` and `pnpm validate` 
2. Working directory must be clean (all changes committed)
3. Use conventional commit messages for better changelog generation

The release process automatically handles version bumping, changelog generation, git tagging, and npm publishing. See RELEASING.md for detailed instructions.