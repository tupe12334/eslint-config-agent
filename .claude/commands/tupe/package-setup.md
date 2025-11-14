---
description: Initialize or validate package setup with correct package.json, release-it, CI/CD, and build/test configuration. Handles both publishable packages and internal packages.
---

# Package Setup and Validation

You are an expert package configuration manager. Your mission is to ensure packages are correctly set up with proper configuration for publishing (if applicable), CI/CD, testing, and building.

## Overview

This command handles two scenarios:

1. **Publishable Packages**: Full setup with npm publishing, release-it, CI/CD with publish step
2. **Internal/Empty Packages**: Setup without publishing, CI/CD with tests/builds only

Both scenarios ensure:

- ✅ Correct package.json configuration
- ✅ Proper testing setup (vitest if needed)
- ✅ Proper build setup (vite if needed for libraries)
- ✅ Working CI/CD pipeline (GitHub Actions)
- ✅ pnpm as package manager

## Phase 1: Project Analysis

### Step 1: Analyze Current State

First, understand what we're working with:

```bash
# Check if directory is empty
ls -la

# Check for existing package.json
test -f package.json && echo "EXISTS" || echo "MISSING"

# Check if it's a git repository
git rev-parse --git-dir 2>/dev/null && echo "GIT_REPO" || echo "NOT_GIT"

# Check for source files
test -d src && echo "HAS_SOURCE" || echo "NO_SOURCE"

# Check for existing dependencies
test -f package.json && cat package.json | grep -E '"dependencies"|"devDependencies"' || echo "NO_DEPS"

# Check for existing CI/CD
test -d .github/workflows && ls -la .github/workflows/ || echo "NO_CI"
```

**Categorize the project**:

- **Empty folder**: No package.json, no src/, minimal/no files
- **Existing package**: Has package.json
- **New project**: No package.json but has source files

### Step 2: Determine Package Type

Ask the user to clarify the package type:

**Questions to determine**:

1. **Is this package meant to be published to npm?** (Yes/No)
2. **Does this package need a build step?** (Yes for libraries, No for pure Node.js packages)
3. **Does this package need tests?** (Usually Yes)
4. **Package name**: What should the package be called? (e.g., `@scope/package-name`)
5. **Package description**: Brief description of what it does

Based on answers, set:

- `PUBLISHABLE`: true/false
- `NEEDS_BUILD`: true/false
- `NEEDS_TESTS`: true/false
- `PACKAGE_NAME`: string
- `PACKAGE_DESC`: string

## Phase 2: Package.json Setup

### Step 1: Create or Validate package.json

**For new package.json (empty folder or missing)**:

```bash
# Initialize with pnpm
pnpm init
```

Then ensure it has these essential fields:

```json
{
  "name": "PACKAGE_NAME",
  "version": "0.0.0",
  "description": "PACKAGE_DESC",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "spell": "cspell lint '**/*.{ts,js,md,json}' --gitignore",
    "spell:check": "cspell lint '**/*.{ts,js,md,json}' --gitignore",
    "prepare": "husky"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=20.0.0"
  }
}
```

**For existing package.json**:

Validate and fix:

1. ✅ `type` should be `"module"` (ES modules)
2. ✅ `main` points to built output (usually `./dist/index.js`)
3. ✅ `types` points to type definitions (usually `./dist/index.d.ts`)
4. ✅ `files` includes only necessary files (usually `["dist"]`)
5. ✅ `engines.node` specifies minimum Node version
6. ✅ `scripts` includes build, test, lint, format
7. ✅ If publishable: `publishConfig.access` is set correctly

**For publishable packages, add**:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

### Step 2: Install Essential Dependencies

```bash
# Core development dependencies (always needed)
pnpm add -D typescript prettier

# ESLint with eslint-config-agent (LATEST VERSION)
# This is the ONLY ESLint config we use - no other configs needed
pnpm add -D eslint@latest eslint-config-agent@latest

# Git hooks and pre-commit checks
pnpm add -D husky lint-staged

# Spell checking
pnpm add -D cspell

# Add vitest if tests needed
if [ "$NEEDS_TESTS" = "true" ]; then
  pnpm add -D vitest @vitest/coverage-v8
fi

# Add release-it and package.json validation if publishable
if [ "$PUBLISHABLE" = "true" ]; then
  pnpm add -D release-it eslint-config-publishable-package-json
fi

# Note: For most TS packages, tsc is sufficient for building
# Only add vite if specifically building a library with complex bundling requirements
```

## Phase 3: TypeScript Configuration

### Step 1: Create or Validate tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.spec.ts"]
}
```

**Validation checklist**:

- ✅ `strict: true` for type safety
- ✅ `declaration: true` for .d.ts files
- ✅ `outDir` matches package.json main field
- ✅ `rootDir` is `./src`

## Phase 4: Testing Setup (if needed)

### Step 1: Create vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.config.ts',
        'coverage/',
      ],
    },
  },
})
```

### Step 2: Create Example Test Structure

Create an example test file next to the source file `src/index.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { hello } from './index.js'

describe('hello', () => {
  it('should return greeting with name', () => {
    expect(hello('World')).toBe('Hello, World!')
  })
})
```

**Note**: Following DDD principles, test files (`.spec.ts`) should be placed next to their corresponding logic files, not in a separate `__tests__/` directory.

## Phase 5: Linting and Formatting Setup

### Step 1: Create eslint.config.mjs

**IMPORTANT**: Use ONLY `eslint-config-agent` - no other ESLint configs or plugins needed!

**For publishable packages**:

```javascript
import agentConfig from 'eslint-config-agent'
import publishablePackageJson from 'eslint-config-publishable-package-json'

export default [
  ...agentConfig,
  ...publishablePackageJson,
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.mjs'],
  },
]
```

**For internal packages**:

```javascript
import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.mjs'],
  },
]
```

**What each config does**:

- `eslint-config-agent`: Complete, opinionated ESLint configuration optimized for AI-assisted development
- `eslint-config-publishable-package-json`: Validates package.json fields for npm publishing (publishable packages only)

### Step 2: Create .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

### Step 3: Create .prettierignore

```
dist
node_modules
coverage
*.min.js
pnpm-lock.yaml
```

### Step 4: Create cspell.json

Spell checking configuration for the project:

```json
{
  "version": "0.2",
  "language": "en",
  "words": ["tupe", "pnpm", "vitest", "husky", "eslint", "tsconfig", "esbenp"],
  "ignorePaths": [
    "node_modules",
    "dist",
    "coverage",
    "pnpm-lock.yaml",
    "*.min.js"
  ]
}
```

**Note**: Add project-specific words to the `words` array as needed.

## Phase 6: Git Hooks Setup (Husky + lint-staged)

### Step 1: Initialize Husky

```bash
# Initialize husky
pnpm exec husky init

# This creates:
# - .husky/ directory
# - .husky/pre-commit (example hook)
```

### Step 2: Create pre-push Hook

Create `.husky/pre-push` file to run checks before pushing:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-push checks..."

# Run linting
echo "📝 Checking linting..."
pnpm lint || {
  echo "❌ Linting failed. Please fix errors before pushing."
  exit 1
}

# Run format check
echo "💅 Checking formatting..."
pnpm format:check || {
  echo "❌ Formatting check failed. Run 'pnpm format' to fix."
  exit 1
}

# Run spell check
echo "📖 Checking spelling..."
pnpm spell || {
  echo "❌ Spell check failed. Please fix spelling errors."
  exit 1
}

# Run tests
echo "🧪 Running tests..."
pnpm test --run || {
  echo "❌ Tests failed. Please fix failing tests before pushing."
  exit 1
}

echo "✅ All pre-push checks passed!"
```

Make it executable:

```bash
chmod +x .husky/pre-push
```

### Step 3: Configure lint-staged

Create `.lintstagedrc.json` for staged file linting:

```json
{
  "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md}": ["prettier --write"],
  "*.{ts,js,md,json}": ["cspell lint --no-must-find-files"]
}
```

### Step 4: Create pre-commit Hook

Create `.husky/pre-commit` for staged files:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
pnpm exec lint-staged
```

Make it executable:

```bash
chmod +x .husky/pre-commit
```

### Step 5: Verify Husky Setup

```bash
# Check husky hooks exist
ls -la .husky/

# Should show:
# - pre-commit (runs lint-staged on staged files)
# - pre-push (runs full lint, format, spell, test checks)

# Test pre-commit hook manually
git add .
.husky/pre-commit

# Test pre-push hook manually
.husky/pre-push
```

**Hook Workflow**:

1. **pre-commit**: Runs on `git commit`
   - Lints and formats only staged files
   - Runs spell check on staged files
   - Fast feedback loop

2. **pre-push**: Runs on `git push`
   - Full project lint check
   - Full format check
   - Full spell check
   - All tests must pass
   - Ensures nothing broken is pushed

## Phase 7: Release Configuration (Publishable Packages Only)

**IMPORTANT**: Only set this up if `PUBLISHABLE = true`

### Step 1: Create .release-it.json

```json
{
  "git": {
    "commitMessage": "chore(release): bump version to ${version}",
    "tagName": "v${version}",
    "requireBranch": "main",
    "requireCleanWorkingDir": true
  },
  "npm": {
    "publish": true
  },
  "github": {
    "release": true
  },
  "hooks": {
    "before:init": ["pnpm test", "pnpm build"]
  }
}
```

### Step 2: Add Release Script to package.json

Ensure package.json has:

```json
{
  "scripts": {
    "release": "release-it"
  }
}
```

## Phase 8: CI/CD Setup

### Step 1: Create GitHub Actions Directory

```bash
mkdir -p .github/workflows
```

### Step 2: Create CI/CD Workflow

**For Publishable Packages** (`.github/workflows/ci.yml`):

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20, 22]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: latest

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Format check
        run: pnpm format:check

      - name: Run tests
        run: pnpm test --run

      - name: Build
        run: pnpm build

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Check if version changed
        id: version_check
        run: |
          # Get current version from package.json
          CURRENT_VERSION=$(node -p "require('./package.json').version")
          echo "Current version: $CURRENT_VERSION"

          # Get version from previous commit
          git checkout HEAD~1 package.json 2>/dev/null || echo "No previous commit"
          PREV_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "none")
          echo "Previous version: $PREV_VERSION"

          # Restore current package.json
          git checkout HEAD package.json

          # Compare versions
          if [ "$CURRENT_VERSION" != "$PREV_VERSION" ]; then
            echo "Version changed from $PREV_VERSION to $CURRENT_VERSION"
            echo "should_publish=true" >> $GITHUB_OUTPUT
          else
            echo "Version unchanged, skipping publish"
            echo "should_publish=false" >> $GITHUB_OUTPUT
          fi

      - name: Install pnpm
        if: steps.version_check.outputs.should_publish == 'true'
        uses: pnpm/action-setup@v4
        with:
          version: latest

      - name: Setup Node.js
        if: steps.version_check.outputs.should_publish == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        if: steps.version_check.outputs.should_publish == 'true'
        run: pnpm install --frozen-lockfile

      - name: Build
        if: steps.version_check.outputs.should_publish == 'true'
        run: pnpm build

      - name: Publish to npm
        if: steps.version_check.outputs.should_publish == 'true'
        run: pnpm publish --access public --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Version Change Detection**:

The publish job includes a smart version change check that:

- Compares the current package.json version with the previous commit's version
- Only publishes to npm when the version has actually changed
- Skips all publish steps (saving CI time) if the version is unchanged
- Prevents accidental duplicate publishes of the same version

This means you **must bump the version** in package.json before merging to main for a publish to occur. You can either:

1. Manually edit package.json and change the version
2. Use `pnpm release` which handles version bumping, changelog, and git tags automatically

**For Internal/Non-Publishable Packages** (`.github/workflows/ci.yml`):

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20, 22]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4
        with:
          version: latest

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Format check
        run: pnpm format:check

      - name: Run tests
        run: pnpm test --run

      - name: Build
        run: pnpm build
```

### Step 3: Verify GitHub CLI and Repository Setup

```bash
# Verify gh CLI is installed
gh --version

# Verify gh authentication
gh auth status

# Check repository settings
gh repo view

# Verify secrets (for publishable packages)
if [ "$PUBLISHABLE" = "true" ]; then
  echo "⚠️  Make sure NPM_TOKEN secret is set in repository settings"
  gh secret list
fi
```

## Phase 9: Project Structure Setup

### Step 1: Create Source Directory

```bash
# Create src directory if it doesn't exist
mkdir -p src

# Create example index.ts if src is empty
if [ ! -f src/index.ts ]; then
  cat > src/index.ts << 'EOF'
/**
 * Main entry point for the package
 */

export function hello(name: string): string {
  return 'Hello, ' + name + '!'
}
EOF
fi
```

### Step 2: Create .gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build output
dist/
build/

# Testing
coverage/
.nyc_output

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Claude Code temporary files
.claude-container/
eslint-report.json

# Temporary files
*.tmp
.cache/
```

### Step 3: Create CONTRIBUTING.md

Create a comprehensive contributing guide for the project:

````bash
if [ ! -f CONTRIBUTING.md ]; then
  cat > CONTRIBUTING.md << 'EOF'
# Contributing to [PACKAGE_NAME]

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `pnpm install`
3. **Create a branch** for your changes: `git checkout -b feature/your-feature-name`

## Development Workflow

### Prerequisites

- Node.js >= 20.0.0
- pnpm (latest version)

### Setup

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
````

### Development Commands

- `pnpm dev` - Build in watch mode
- `pnpm test` - Run tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Check code quality
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code
- `pnpm format:check` - Check formatting
- `pnpm spell` - Check spelling

## Making Changes

### Code Style

This project uses:

- **TypeScript** with strict mode
- **ESLint** with `eslint-config-agent` for linting
- **Prettier** for code formatting
- **cspell** for spell checking

The codebase follows these conventions:

- ES modules (use `.js` extensions in imports)
- Strict TypeScript types
- Descriptive variable and function names
- Comprehensive JSDoc comments for public APIs

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:

```
feat(api): add user authentication endpoint
fix(parser): handle edge case in date parsing
docs(readme): update installation instructions
```

### Testing

- Write tests for all new features and bug fixes
- Ensure all tests pass: `pnpm test`
- Maintain or improve code coverage
- Tests should be in `.spec.ts` files next to their corresponding logic files (DDD approach)
- Use descriptive test names

### Git Hooks

This project uses Husky for git hooks:

- **Pre-commit**: Runs lint-staged (lints, formats, and spell-checks staged files)
- **Pre-push**: Runs full validation (lint, format, spell check, tests)

These hooks ensure code quality before commits and pushes.

## Submitting Changes

### Pull Request Process

1. **Update your fork** with the latest changes from main:

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Rebase your branch** (if needed):

   ```bash
   git checkout your-branch
   git rebase main
   ```

3. **Run all checks locally**:

   ```bash
   pnpm lint
   pnpm format:check
   pnpm spell
   pnpm test
   pnpm build
   ```

4. **Push your changes**:

   ```bash
   git push origin your-branch
   ```

5. **Open a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to any related issues
   - Screenshots (if UI changes)

### Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Write clear, descriptive PR titles and descriptions
- Link related issues using "Fixes #123" or "Closes #123"
- Ensure CI passes (tests, linting, formatting)
- Respond to review feedback promptly
- Keep commits clean and well-organized

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: Node.js version, OS, package version
- **Error messages**: Full error messages or stack traces
- **Code samples**: Minimal reproduction if possible

### Feature Requests

When requesting features, please include:

- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives**: What alternatives have you considered?
- **Examples**: Examples of similar features elsewhere

## Questions?

- Check existing issues and discussions
- Read the documentation in README.md
- Open a new issue with the "question" label

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and beginners
- Focus on constructive feedback
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

---

Thank you for contributing! 🎉
EOF
echo "✅ Created CONTRIBUTING.md"
else
echo "ℹ️ CONTRIBUTING.md already exists"
fi

````

### Step 4: Create LICENSE File

Create an MIT License file (or ask user for preference):

```bash
# Ask user for license preference if this is a new project
if [ ! -f LICENSE ]; then
  # Get current year
  YEAR=$(date +%Y)

  # Get author from package.json or git config
  AUTHOR=$(node -p "require('./package.json').author" 2>/dev/null || git config user.name || echo "Your Name")

  cat > LICENSE << EOF
MIT License

Copyright (c) $YEAR $AUTHOR

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
  echo "✅ Created LICENSE (MIT)"
else
  echo "ℹ️  LICENSE already exists"
fi
````

**Note**: The MIT License is used by default. If you need a different license (Apache-2.0, GPL-3.0, etc.), you can:

1. Replace the LICENSE content after running this command
2. Use GitHub's license chooser: [choosealicense.com](https://choosealicense.com/)
3. Update the `license` field in package.json to match

## Phase 10: Validation and Testing

### Step 1: Validate Configuration

```bash
# Check package.json is valid
pnpm run --help

# Verify TypeScript configuration
pnpm tsc --noEmit

# Run linter
pnpm lint

# Check formatting
pnpm format:check

# Run tests (if configured)
if [ "$NEEDS_TESTS" = "true" ]; then
  pnpm test --run
fi

# Try building
pnpm build

# Verify dist output exists
ls -la dist/
```

### Step 2: Test Local Installation

```bash
# Link package locally to test
pnpm link --global

# Verify package can be imported (if applicable)
# node -e "import('./dist/index.js').then(m => console.log(m))"
```

### Step 3: Verify CI/CD Configuration

```bash
# Validate workflow files
gh workflow list

# Check if workflow file is valid YAML
for file in .github/workflows/*.yml; do
  echo "Validating $file"
  # gh CLI will validate workflow files
  gh workflow view $(basename "$file" .yml) || echo "⚠️  Workflow validation failed"
done
```

## Phase 11: Final Checklist and Summary

### Validation Checklist

Review and confirm:

**Package Configuration**:

- ✅ package.json exists with correct fields
- ✅ `type: "module"` for ES modules
- ✅ `main` and `types` fields point to dist/
- ✅ `files` field includes only necessary files
- ✅ `engines.node` specifies version requirement
- ✅ All scripts (build, test, lint, format) work
- ✅ If publishable: `publishConfig.access` is set

**TypeScript Configuration**:

- ✅ tsconfig.json exists with strict mode
- ✅ Compiles without errors (`pnpm tsc --noEmit`)
- ✅ Generates .d.ts files (`declaration: true`)

**Testing Setup** (if needed):

- ✅ vitest.config.ts exists
- ✅ Tests run successfully (`pnpm test`)
- ✅ Coverage configuration works

**Linting and Formatting**:

- ✅ eslint.config.mjs exists with eslint-config-agent@latest
- ✅ If publishable: eslint-config-publishable-package-json validates package.json
- ✅ .prettierrc exists
- ✅ cspell.json exists
- ✅ Linting passes (`pnpm lint`)
- ✅ Formatting is correct (`pnpm format:check`)
- ✅ Spell checking passes (`pnpm spell`)

**CI/CD**:

- ✅ .github/workflows/ci.yml exists
- ✅ Workflow is valid YAML
- ✅ Tests node versions 20, 22
- ✅ Runs lint, format, test, build
- ✅ If publishable: Has publish job with NPM_TOKEN
- ✅ If publishable: Publish only runs when package.json version changes

**Release Configuration** (if publishable):

- ✅ release-it installed as devDependency
- ✅ .release-it.json exists and configured
- ✅ `pnpm release` script exists

**Git Hooks (Husky + lint-staged)**:

- ✅ Husky installed and initialized
- ✅ .husky/pre-commit exists (runs lint-staged)
- ✅ .husky/pre-push exists (runs full checks)
- ✅ .lintstagedrc.json configured
- ✅ Pre-commit hook works (test manually)
- ✅ Pre-push hook works (test manually)

**Git Configuration**:

- ✅ .gitignore exists and excludes dist/, node_modules/
- ✅ Repository is connected to GitHub
- ✅ gh CLI is authenticated
- ✅ If publishable: NPM_TOKEN secret is set

**Documentation**:

- ✅ CONTRIBUTING.md exists with contribution guidelines
- ✅ LICENSE file exists (MIT or chosen license)
- ✅ README.md has basic project information
- ✅ License in package.json matches LICENSE file

### Generate Summary Report

Provide a comprehensive summary:

```text
📦 Package Setup Complete!

Package: PACKAGE_NAME
Type: [Publishable | Internal]
Version: X.X.X

✅ Configuration Files Created:
  - package.json (ES modules, pnpm)
  - tsconfig.json (strict TypeScript)
  - vitest.config.ts (testing)
  - eslint.config.mjs (eslint-config-agent@latest [+ package.json validation if publishable])
  - .prettierrc (formatting)
  - .prettierignore
  - cspell.json (spell checking)
  - .lintstagedrc.json (staged file linting)
  - .husky/pre-commit (lint-staged on commit)
  - .husky/pre-push (full checks before push)
  - .gitignore (git exclusions)
  - CONTRIBUTING.md (contribution guidelines)
  - LICENSE (MIT license)
  [- .release-it.json (releases)] - if publishable
  - .github/workflows/ci.yml (CI/CD)

✅ Dependencies Installed:
  - TypeScript
  - ESLint@latest + eslint-config-agent@latest
  - Prettier
  - cspell (spell checking)
  - Husky + lint-staged (git hooks)
  - Vitest (testing)
  [- release-it] - if publishable
  [- eslint-config-publishable-package-json] - if publishable

✅ Scripts Available:
  pnpm build         - Build TypeScript
  pnpm dev           - Watch mode
  pnpm test          - Run tests
  pnpm test:watch    - Test watch mode
  pnpm test:coverage - Coverage report
  pnpm lint          - Check code quality
  pnpm lint:fix      - Fix linting issues
  pnpm format        - Format code
  pnpm format:check  - Check formatting
  pnpm spell         - Spell check
  [pnpm release]     - Create release - if publishable

✅ Git Hooks Configured:
  Pre-commit:  Runs lint-staged (lint, format, spell check staged files)
  Pre-push:    Runs full validation (lint, format, spell, tests)

✅ CI/CD Setup:
  - GitHub Actions workflow configured
  - Tests on Node 20, 22
  - Runs lint, format, spell, test, build
  [- Auto-publishes to npm on main push (only when version changes)] - if publishable

⚠️  Next Steps:
  1. [If publishable] Add NPM_TOKEN secret to GitHub repository
  2. Review and customize CONTRIBUTING.md for your project
  3. Verify LICENSE file has correct copyright year and author
  4. Test git hooks (make a commit to test pre-commit, try pushing to test pre-push)
  5. Write your package code in src/
  6. Add tests in `.spec.ts` files next to your logic files (DDD approach)
  7. Update package.json metadata (author, keywords, description, repository URL)
  8. Add project-specific words to cspell.json
  9. Push to GitHub to trigger CI
  [10. Run `pnpm release` to publish first version] - if publishable

🚀 Ready to develop!
```

## Important Notes

### For Publishable Packages

1. **NPM Token Required**: You must add `NPM_TOKEN` secret to GitHub repository settings:

   ```bash
   # Get npm token from ~/.npmrc or create one:
   npm token create

   # Add to GitHub secrets:
   gh secret set NPM_TOKEN
   ```

2. **Initial Version**: Start at `0.0.0` or `0.1.0`, let release-it handle versioning

3. **Publishing Workflow**:
   - Develop and commit to feature branches
   - Merge to main (triggers CI)
   - If tests pass AND version changed, automatically publishes
   - Version must be bumped in package.json for publish to trigger
   - Or use `pnpm release` for manual release with changelog and version bump

### For Internal Packages

1. **No Publishing**: CI runs tests and builds but doesn't publish
2. **GitHub Integration**: Use gh CLI for PRs, issues, etc.
3. **Private Use**: Can still use in monorepo or link locally

### Build Tool Selection

- **TypeScript only**: Use `tsc` (most packages) - already configured
- **Library with bundling**: Add vite or rollup if needed (special cases)
- **Default**: TypeScript compiler is sufficient for most cases

### Testing Strategy

- **Required for libraries**: Always set up tests
- **Optional for apps**: But highly recommended
- **Coverage**: Aim for >80% coverage

## Troubleshooting

### Common Issues

1. **`pnpm install` fails**:
   - Check Node.js version (need >= 20)
   - Clear pnpm cache: `pnpm store prune`

2. **TypeScript compilation fails**:
   - Check tsconfig.json paths match
   - Verify src/ directory exists
   - Run `pnpm tsc --noEmit` for details

3. **CI fails on GitHub**:
   - Check workflow YAML syntax
   - Verify secrets are set (if publishable)
   - Check package.json scripts exist

4. **Publishing fails**:
   - Verify NPM_TOKEN secret is set
   - Check npm package name is available
   - Verify publishConfig.access is correct

5. **Tests fail**:
   - Check vitest.config.ts exists
   - Verify test files match pattern `*.spec.ts`
   - Run locally first: `pnpm test`

## Success Criteria

After running this command, the package should:

✅ Have valid package.json with all required fields
✅ Build successfully with `pnpm build`
✅ Pass all tests with `pnpm test`
✅ Pass linting with `pnpm lint`
✅ Pass formatting checks with `pnpm format:check`
✅ Have working CI/CD pipeline
✅ Be ready to publish (if publishable) or use (if internal)

The package is now production-ready! 🎉
