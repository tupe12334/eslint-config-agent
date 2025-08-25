# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESLint configuration package (`@tupe12334/eslint-config`) that provides TypeScript and JavaScript linting rules. The package exports a reusable ESLint configuration that can be consumed by other projects.

## Development Setup

The project uses pnpm as the package manager. Dependencies are already installed.

## Common Commands

- `pnpm lint` - Run ESLint on the entire project
- `pnpm test` - Run validation tests for valid and invalid code samples
- `pnpm test:ci` - Run ESLint with zero warnings allowed (used for CI)
- `pnpm validate` - Run comprehensive configuration validation
- `pnpm install` - Install dependencies

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

The package includes comprehensive testing via test files that should trigger specific ESLint rules. Run `pnpm validate` to ensure all rules are working correctly.