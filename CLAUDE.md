# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an ESLint configuration package (`@tupe12334/eslint-config`) that provides TypeScript and JavaScript linting rules. The package exports a reusable ESLint configuration that can be consumed by other projects.

## Development Setup

The project uses pnpm as the package manager. Dependencies are already installed.

## Common Commands

- `pnpm lint` - Run ESLint on the entire project
- `pnpm test` - Run ESLint with zero warnings allowed (used for CI)
- `pnpm install` - Install dependencies

## Architecture

The project follows the modern ESLint flat configuration format:

- `index.js` - Main configuration export that other projects will consume
- `eslint.config.js` - Local ESLint configuration for this project itself
- Both configurations use ES modules and TypeScript ESLint integration

The main export combines:
- `@eslint/js` recommended rules
- `typescript-eslint` recommended configuration
- Custom rules for enhanced code quality

Other projects can consume this configuration by installing the package and importing it in their ESLint config.