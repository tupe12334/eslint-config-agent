---
description: Initialize or validate package setup with correct package.json, release-it, commitlint, knip, CI/CD, build/test configuration, and code coverage testing. Handles both publishable packages and internal packages.
---

# Package Setup and Validation

You are an expert package configuration manager. Your mission is to ensure packages are correctly set up with proper configuration for publishing (if applicable), CI/CD, testing with coverage thresholds, and building.

## Overview

This command handles two scenarios:

1. **Publishable Packages**: Full setup with npm publishing, release-it, CI/CD with publish step
2. **Internal/Empty Packages**: Setup without publishing, CI/CD with tests/builds only

Both scenarios ensure:

- ✅ Correct package.json configuration
- ✅ Proper testing setup with coverage thresholds (vitest if needed)
- ✅ Code coverage reporting with 80% minimum thresholds
- ✅ Proper build setup (vite if needed for libraries)
- ✅ Unused code detection (knip configuration)
- ✅ Working CI/CD pipeline with coverage uploads (GitHub Actions)
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
    "knip": "knip",
    "prepare": "husky"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/OWNER/REPO.git"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=20.0.0"
  },
  "packageManager": "pnpm@PNPM_LTS_VERSION"
}
```

**Setting the packageManager field**:

The `packageManager` field enforces a specific pnpm version for the project. To get the current pnpm LTS version:

```bash
# Get the latest stable pnpm version
PNPM_LTS_VERSION=$(pnpm --version)
echo "Current pnpm version: $PNPM_LTS_VERSION"

# Or fetch the latest from npm registry
PNPM_LTS_VERSION=$(npm view pnpm version)
echo "Latest pnpm version: $PNPM_LTS_VERSION"
```

Then set it in package.json:

```bash
# Update packageManager field with the LTS version
npm pkg set packageManager="pnpm@$PNPM_LTS_VERSION"
```

**Why this matters**:

- Ensures all developers use the same pnpm version
- Corepack uses this field to auto-install the correct version
- Prevents version-related bugs across different environments
- CI/CD will use the exact same pnpm version as local development

**For existing package.json**:

Validate and fix:

1. ✅ `type` should be `"module"` (ES modules)
2. ✅ `main` points to built output (usually `./dist/index.js`)
3. ✅ `types` points to type definitions (usually `./dist/index.d.ts`)
4. ✅ `files` includes only necessary files (usually `["dist"]`)
5. ✅ `engines.node` specifies minimum Node version
6. ✅ `scripts` includes build, test, lint, format
7. ✅ `packageManager` is set to pnpm LTS version (e.g., `pnpm@10.x.x`)
8. ✅ If publishable: `publishConfig.access` is set correctly
9. ✅ If publishable: `repository.url` points to GitHub repo (required for OIDC provenance)

**Updating packageManager for existing projects**:

```bash
# Get and set the latest pnpm LTS version
PNPM_LTS_VERSION=$(npm view pnpm version)
npm pkg set packageManager="pnpm@$PNPM_LTS_VERSION"
echo "✅ Set packageManager to pnpm@$PNPM_LTS_VERSION"
```

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

# Commit message linting
pnpm add -D @commitlint/cli @commitlint/config-conventional

# Spell checking with Hebrew dictionary
pnpm add -D cspell @cspell/dict-he

# Knip for finding unused files, dependencies, and exports
pnpm add -D knip

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
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/*.config.ts',
        'coverage/',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

**Coverage Configuration**:

- **provider: 'v8'**: Uses V8 coverage (fast and accurate)
- **reporter**: Outputs multiple formats:
  - `text`: Console output
  - `json`: Machine-readable format
  - `html`: Interactive HTML report (view in browser)
  - `lcov`: Standard format for coverage tools and CI services
- **thresholds**: Enforces minimum coverage requirements (80% for all metrics)
  - Tests will fail if coverage drops below these thresholds
  - Prevents merging code that reduces coverage
- **exclude**: Ignores test files, config files, and build output from coverage

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
  publishablePackageJson,
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

Spell checking configuration for the project with Hebrew support:

```json
{
  "version": "0.2",
  "language": "en,he",
  "dictionaries": ["he"],
  "words": ["tupe", "pnpm", "vitest", "husky", "eslint", "tsconfig", "esbenp"],
  "languageSettings": [
    {
      "languageId": "*",
      "locale": "en,he"
    }
  ],
  "ignorePaths": [
    "node_modules",
    "dist",
    "coverage",
    "pnpm-lock.yaml",
    "*.min.js"
  ]
}
```

**Note**:

- Hebrew language support requires the `@cspell/dict-he` package (installed in dependencies)
- The `dictionaries: ["he"]` enables the Hebrew dictionary
- `language: "en,he"` sets both English and Hebrew as recognized languages
- Add project-specific words to the `words` array as needed
- The spell checker will now recognize both English and Hebrew text

### Step 5: Create knip.json

Knip finds unused files, dependencies, and exports in your TypeScript project:

```json
{
  "$schema": "https://unpkg.com/knip@latest/schema.json",
  "entry": ["src/index.ts", "src/cli.ts"],
  "project": ["src/**/*.ts"],
  "ignore": ["**/*.spec.ts", "**/*.test.ts", "dist/**", "coverage/**"],
  "ignoreDependencies": [],
  "ignoreExportsUsedInFile": true,
  "ignoreWorkspaces": []
}
```

**Configuration Explanation**:

- **entry**: Main entry points of your package (where execution starts)
- **project**: All TypeScript files to analyze
- **ignore**: Files to exclude from analysis (tests, build output, coverage)
- **ignoreDependencies**: Dependencies to ignore (useful for runtime-only deps)
- **ignoreExportsUsedInFile**: Allows exports that are only used in the same file
- **ignoreWorkspaces**: For monorepos, workspaces to skip

**Common Entry Points**:

- **CLI packages**: `["src/cli.ts", "src/index.ts"]`
- **Libraries**: `["src/index.ts"]`
- **Applications**: `["src/main.ts", "src/app.ts"]`

**What Knip Detects**:

- Unused files (files not imported anywhere)
- Unused dependencies (installed but never imported)
- Unused devDependencies (installed but not used in scripts or code)
- Unused exports (exported but never imported)
- Duplicate exports
- Unlisted dependencies (imported but not in package.json)

**Note**: Adjust the `entry` field based on your package's actual entry points. Check package.json `main`, `bin`, and `exports` fields to identify all entry points.

### Step 6: Create commitlint.config.mjs

Commit message linting configuration for enforcing conventional commits:

```javascript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'perf',
        'ci',
        'build',
        'revert',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'header-max-length': [2, 'always', 100],
  },
}
```

**What this does**:

- Enforces conventional commit format: `type(scope): description`
- Validates commit message types (feat, fix, docs, etc.)
- Ensures subject line doesn't start with uppercase
- Limits header to 100 characters
- Runs automatically on every commit via husky

## Phase 6: Git Hooks Setup (Husky + lint-staged + commitlint)

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

# Check for unused code
echo "🔍 Checking for unused code..."
pnpm knip || {
  echo "❌ Knip found unused code. Please review and fix."
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


# Run lint-staged
pnpm exec lint-staged
```

Make it executable:

```bash
chmod +x .husky/pre-commit
```

### Step 5: Create commit-msg Hook

Create `.husky/commit-msg` for commit message linting:

```bash


# Run commitlint on commit message
pnpm exec commitlint --edit "$1"
```

Make it executable:

```bash
chmod +x .husky/commit-msg
```

**What this does**:

- Runs commitlint on every commit message
- Validates commit follows conventional commit format
- Blocks commits with invalid messages
- Provides helpful error messages about what's wrong

**Example validation**:

```bash
# ✅ Valid commits:
git commit -m "feat(api): add user authentication"
git commit -m "fix(parser): handle null values"
git commit -m "docs(readme): update installation steps"

# ❌ Invalid commits:
git commit -m "Add feature"  # Missing type
git commit -m "FEAT: something"  # Wrong format
git commit -m "random stuff"  # No conventional format
```

### Step 6: Verify Husky Setup

```bash
# Check husky hooks exist
ls -la .husky/

# Should show:
# - pre-commit (runs lint-staged on staged files)
# - commit-msg (validates commit message format)
# - pre-push (runs full lint, format, spell, knip, test checks)

# Test pre-commit hook manually
git add .
.husky/pre-commit

# Test commit-msg hook manually
echo "feat(test): testing commitlint" | .husky/commit-msg

# Test pre-push hook manually
.husky/pre-push
```

**Hook Workflow**:

1. **pre-commit**: Runs on `git commit` (before commit message)
   - Lints and formats only staged files
   - Runs spell check on staged files
   - Fast feedback loop

2. **commit-msg**: Runs on `git commit` (after entering commit message)
   - Validates commit message format
   - Enforces conventional commits
   - Blocks non-conforming messages
   - Provides helpful error feedback

3. **pre-push**: Runs on `git push`
   - Full project lint check
   - Full format check
   - Full spell check
   - Full knip check (unused code detection)
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

      - name: Spell check
        run: pnpm spell

      - name: Check for unused code
        run: pnpm knip

      - name: Run tests with coverage
        run: pnpm test:coverage --run

      - name: Upload coverage reports
        uses: codecov/codecov-action@v4
        if: matrix.node-version == 20
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}

      - name: Build
        run: pnpm build

  publish:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    permissions:
      contents: read
      id-token: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Check if should publish
        id: version_check
        run: |
          PACKAGE_NAME=$(node -p "require('./package.json').name")
          CURRENT_VERSION=$(node -p "require('./package.json').version")
          echo "Package: $PACKAGE_NAME@$CURRENT_VERSION"

          # Check the time field which includes all historically published versions,
          # even ones that were later unpublished (npm blocks re-publishing those).
          # This is critical for transferred packages where the previous owner may
          # have published and unpublished versions that are invisible to `npm view @version`.
          if npm view "$PACKAGE_NAME" time --json 2>/dev/null | grep -q "\"$CURRENT_VERSION\""; then
            echo "Version $CURRENT_VERSION was previously published, skipping"
            echo "should_publish=false" >> $GITHUB_OUTPUT
          else
            echo "Version $CURRENT_VERSION never published, will publish"
            echo "should_publish=true" >> $GITHUB_OUTPUT
          fi

      - name: Install pnpm
        if: steps.version_check.outputs.should_publish == 'true'
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        if: steps.version_check.outputs.should_publish == 'true'
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install latest npm (required for OIDC trusted publishing)
        if: steps.version_check.outputs.should_publish == 'true'
        run: npm install -g npm@latest

      - name: Install dependencies
        if: steps.version_check.outputs.should_publish == 'true'
        run: pnpm install --frozen-lockfile

      - name: Build
        if: steps.version_check.outputs.should_publish == 'true'
        run: pnpm build

      - name: Publish to npm
        if: steps.version_check.outputs.should_publish == 'true'
        run: npm publish --provenance --access public
```

**OIDC Trusted Publishing Setup**:

Since December 2025, npm classic tokens have been permanently revoked. The workflow above uses **OIDC trusted publishing**, which requires no secrets at all. To set it up:

1. **Ensure `repository.url` is set in package.json** (required for provenance verification):

   ```json
   {
     "repository": {
       "type": "git",
       "url": "git+https://github.com/OWNER/REPO.git"
     }
   }
   ```

   **Important**: Use the `git+https://...git` format. npm will auto-correct other formats with a warning during publish.

2. **Configure trusted publishing on npmjs.com**:
   - Go to your package settings on npmjs.com
   - Navigate to Settings > Trusted Publisher > GitHub Actions
   - Fill in: organization/user, repository name, workflow filename (`ci.yml`)
   - Click "Set up connection"

3. **Key requirements**:
   - `permissions: id-token: write` on the publish job (for OIDC token generation)
   - `npm install -g npm@latest` (OIDC auth requires npm >= 11.5.1)
   - `npm publish --provenance --access public` (uses npm directly, not pnpm, for OIDC support)
   - Do NOT set `registry-url` in `actions/setup-node` (it creates token-based `.npmrc` that overrides OIDC)
   - Do NOT set `NODE_AUTH_TOKEN` env var

4. **Benefits**:
   - No secrets to manage or rotate — zero token maintenance
   - Provenance attestation (`--provenance`) for supply chain security
   - Handles 2FA automatically
   - No 90-day token expiration to worry about

**Fallback: Granular Access Tokens**:

If OIDC trusted publishing isn't available (e.g., private packages, self-hosted runners), use granular access tokens:

```bash
# Create a granular access token via npmjs.com:
# Settings > Access Tokens > Generate New Token > Granular Access Token
# Configure: package scope, read-write permissions, expiration (max 90 days for write)
# Enable "Bypass 2FA" for CI/CD automation

# Add to GitHub secrets:
gh secret set NPM_TOKEN
```

Then update the workflow to use token auth instead:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: 20
    cache: 'pnpm'
    registry-url: 'https://registry.npmjs.org'

- name: Publish to npm
  run: pnpm publish --provenance --access public --no-git-checks
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Important**: Granular write tokens expire after a maximum of 90 days. You must rotate them before expiration or your CI/CD publishing will break. OIDC trusted publishing avoids this problem entirely.

**Publish Detection**:

The publish job checks the npm registry to decide whether to publish:

- Queries npm's `time` field which includes **all historically published versions**, even ones that were later unpublished
- This is critical for **transferred package names** where the previous owner may have published and unpublished versions — npm permanently blocks those version numbers, but `npm view @version` won't find them
- Publishes if the version was never published (new version or first publish)
- Skips all publish steps if the version was ever published (current or historical)
- Handles first-time publishes automatically (package not yet on npm)
- Prevents accidental duplicate publishes of the same version

This means you **must bump the version** in package.json before merging to main for a publish to occur. You can either:

1. Manually edit package.json and change the version
2. Use `pnpm release` which handles version bumping, changelog, and git tags automatically

**For transferred package names**: Check which versions were historically published before choosing your initial version:

```bash
# View all historically published versions (including unpublished ones)
npm view PACKAGE_NAME time --json
```

Pick a version higher than any previously used version number.

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

      - name: Spell check
        run: pnpm spell

      - name: Check for unused code
        run: pnpm knip

      - name: Run tests with coverage
        run: pnpm test:coverage --run

      - name: Upload coverage reports
        uses: codecov/codecov-action@v4
        if: matrix.node-version == 20
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: false
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}

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

# Verify secrets
gh secret list

# For publishable packages
if [ "$PUBLISHABLE" = "true" ]; then
  echo "⚠️  Publishing setup for publishable packages:"
  echo "   1. Configure OIDC trusted publishing on npmjs.com (no secrets needed)"
  echo "   2. Ensure repository.url is set in package.json"
  echo "   OPTIONAL: CODECOV_TOKEN (for coverage reports)"
else
  echo "⚠️  Optional secret for coverage reporting:"
  echo "   - CODECOV_TOKEN (sign up at codecov.io)"
fi
```

**Setting up Codecov (optional but recommended)**:

1. Go to [codecov.io](https://codecov.io) and sign up with GitHub
2. Add your repository to Codecov
3. Get the upload token from Codecov settings
4. Add as GitHub secret:
   ```bash
   gh secret set CODECOV_TOKEN
   # Paste your Codecov token when prompted
   ```
5. Coverage reports will be automatically uploaded on each CI run
6. Add coverage badge to README.md (see Codecov dashboard for badge markdown)

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

# Playwright MCP
.playwright-mcp/

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
- `pnpm knip` - Find unused files, dependencies, and exports

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
- **Commit-msg**: Validates commit message format using commitlint (enforces conventional commits)
- **Pre-push**: Runs full validation (lint, format, spell, knip, tests)

These hooks ensure code quality and consistent commit messages before commits and pushes.

**Important**: Commit messages must follow the conventional commits format or they will be rejected. See the "Commit Messages" section above for details.

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
   pnpm knip
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

### Step 5: Create README.md

Create a comprehensive README file for the project. This should be the last file created, as it references tools, scripts, and configurations set up in earlier phases.

Use the appropriate template based on the package type:

**For publishable packages**:

````bash
if [ ! -f README.md ]; then
  cat > README.md << 'EOF'
# PACKAGE_NAME

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/PACKAGE_NAME.svg)](https://www.npmjs.com/package/PACKAGE_NAME)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PACKAGE_DESC

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

```bash
pnpm add PACKAGE_NAME
```

## Usage

```typescript
import { hello } from 'PACKAGE_NAME'

const greeting = hello('World')
console.log(greeting) // Hello, World!
```

## API

### `hello(name: string): string`

Returns a greeting string for the given name.

**Parameters:**

| Parameter | Type     | Description          |
| --------- | -------- | -------------------- |
| `name`    | `string` | The name to greet    |

**Returns:** `string` - The greeting message

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm (latest version)

### Setup

```bash
# Clone the repository
git clone https://github.com/OWNER/REPO.git
cd REPO

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test
```

### Available Scripts

| Script               | Description                        |
| -------------------- | ---------------------------------- |
| `pnpm build`         | Build TypeScript                   |
| `pnpm dev`           | Build in watch mode                |
| `pnpm test`          | Run tests                          |
| `pnpm test:watch`    | Run tests in watch mode            |
| `pnpm test:coverage` | Run tests with coverage            |
| `pnpm lint`          | Check code quality                 |
| `pnpm lint:fix`      | Fix linting issues                 |
| `pnpm format`        | Format code                        |
| `pnpm format:check`  | Check formatting                   |
| `pnpm spell`         | Check spelling                     |
| `pnpm knip`          | Find unused files and dependencies |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

[MIT](LICENSE)
EOF
  echo "✅ Created README.md"
else
  echo "ℹ️  README.md already exists"
fi
````

**For internal/non-publishable packages**:

````bash
if [ ! -f README.md ]; then
  cat > README.md << 'EOF'
# PACKAGE_NAME

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

PACKAGE_DESC

## Features

- Feature 1
- Feature 2
- Feature 3

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm (latest version)

### Setup

```bash
# Clone the repository
git clone https://github.com/OWNER/REPO.git
cd REPO

# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test
```

## Usage

```typescript
import { hello } from './src/index.js'

const greeting = hello('World')
console.log(greeting) // Hello, World!
```

### Available Scripts

| Script               | Description                        |
| -------------------- | ---------------------------------- |
| `pnpm build`         | Build TypeScript                   |
| `pnpm dev`           | Build in watch mode                |
| `pnpm test`          | Run tests                          |
| `pnpm test:watch`    | Run tests in watch mode            |
| `pnpm test:coverage` | Run tests with coverage            |
| `pnpm lint`          | Check code quality                 |
| `pnpm lint:fix`      | Fix linting issues                 |
| `pnpm format`        | Format code                        |
| `pnpm format:check`  | Check formatting                   |
| `pnpm spell`         | Check spelling                     |
| `pnpm knip`          | Find unused files and dependencies |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

[MIT](LICENSE)
EOF
  echo "✅ Created README.md"
else
  echo "ℹ️  README.md already exists"
fi
````

**README Customization**:

- Replace the `Features` section with actual package features
- Replace the `Usage` and `API` sections with real examples from your package's API
- Update badge URLs by replacing `OWNER/REPO` with your GitHub repository path
- For publishable packages: add a Codecov badge once coverage reporting is configured:
  ```markdown
  [![codecov](https://codecov.io/gh/OWNER/REPO/badge.svg)](https://codecov.io/gh/OWNER/REPO)
  ```
- For publishable packages: document all exported functions, types, and interfaces in the `API` section

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

# Check for unused code
pnpm knip

# Run tests (if configured)
if [ "$NEEDS_TESTS" = "true" ]; then
  pnpm test --run

  # Run tests with coverage
  pnpm test:coverage --run

  # Verify coverage thresholds are met
  echo "✅ Coverage thresholds enforced (80% minimum)"

  # Check coverage output
  ls -la coverage/

  # View coverage report (optional - opens in browser)
  # open coverage/index.html  # macOS
  # xdg-open coverage/index.html  # Linux
fi

# Try building
pnpm build

# Verify dist output exists
ls -la dist/
```

**Coverage Reports Available**:

- **Console output**: Displays coverage summary in terminal
- **HTML report**: Open `coverage/index.html` in browser for interactive report
- **LCOV report**: `coverage/lcov.info` for CI services and editors
- **JSON report**: `coverage/coverage-final.json` for programmatic analysis

**IDE Integration**:

Most modern IDEs can display coverage inline:

- **VS Code**: Install "Coverage Gutters" extension to see coverage in editor
- **WebStorm/IntelliJ**: Built-in coverage visualization using lcov.info
- **Vim/Neovim**: Use coverage.vim plugin

**Coverage Thresholds**:

The vitest configuration enforces 80% minimum coverage for:

- Lines
- Functions
- Branches
- Statements

Tests will **fail** if coverage drops below these thresholds, preventing quality regressions.

**Adjusting Coverage Thresholds**:

To modify coverage requirements, edit `vitest.config.ts`:

```typescript
coverage: {
  thresholds: {
    lines: 90,      // Increase to 90%
    functions: 85,  // Different threshold per metric
    branches: 80,
    statements: 80,
  },
}
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
- ✅ `packageManager` is set to pnpm LTS version (e.g., `pnpm@10.x.x`)
- ✅ All scripts (build, test, lint, format) work
- ✅ If publishable: `publishConfig.access` is set

**TypeScript Configuration**:

- ✅ tsconfig.json exists with strict mode
- ✅ Compiles without errors (`pnpm tsc --noEmit`)
- ✅ Generates .d.ts files (`declaration: true`)

**Testing Setup** (if needed):

- ✅ vitest.config.ts exists with coverage configuration
- ✅ Coverage thresholds configured (80% minimum)
- ✅ Tests run successfully (`pnpm test`)
- ✅ Coverage tests pass (`pnpm test:coverage`)
- ✅ Coverage reports generated (text, html, lcov, json)
- ✅ Coverage thresholds enforced (tests fail if below 80%)

**Linting and Formatting**:

- ✅ eslint.config.mjs exists with eslint-config-agent@latest
- ✅ If publishable: eslint-config-publishable-package-json validates package.json
- ✅ .prettierrc exists
- ✅ cspell.json exists
- ✅ knip.json exists with correct entry points
- ✅ Linting passes (`pnpm lint`)
- ✅ Formatting is correct (`pnpm format:check`)
- ✅ Spell checking passes (`pnpm spell`)
- ✅ Knip reports no unused files/dependencies (`pnpm knip`)

**CI/CD**:

- ✅ .github/workflows/ci.yml exists
- ✅ Workflow is valid YAML
- ✅ Tests node versions 20, 22
- ✅ Runs lint, format, spell, knip, test with coverage, build
- ✅ Uploads coverage reports to Codecov (if CODECOV_TOKEN set)
- ✅ If publishable: Has publish job with OIDC trusted publishing (no secrets needed)
- ✅ If publishable: Publish job has `permissions: id-token: write` for OIDC
- ✅ If publishable: Publish job installs `npm@latest` (>= 11.5.1 required for OIDC auth)
- ✅ If publishable: `repository.url` set in package.json (required for provenance verification)
- ✅ If publishable: Publish only runs when version is not yet on npm (handles first publish and version bumps)

**Release Configuration** (if publishable):

- ✅ release-it installed as devDependency
- ✅ .release-it.json exists and configured
- ✅ `pnpm release` script exists

**Git Hooks (Husky + lint-staged + commitlint)**:

- ✅ Husky installed and initialized
- ✅ commitlint.config.mjs exists (conventional commits config)
- ✅ .husky/pre-commit exists (runs lint-staged)
- ✅ .husky/commit-msg exists (validates commit messages)
- ✅ .husky/pre-push exists (runs full checks)
- ✅ .lintstagedrc.json configured
- ✅ Pre-commit hook works (test manually)
- ✅ Commit-msg hook works (test manually)
- ✅ Pre-push hook works (test manually)

**Git Configuration**:

- ✅ .gitignore exists and excludes dist/, node_modules/
- ✅ Repository is connected to GitHub
- ✅ gh CLI is authenticated
- ✅ If publishable: OIDC trusted publishing configured on npmjs.com (Settings > Trusted Publisher > GitHub Actions)

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
  - package.json (ES modules, pnpm, packageManager set to LTS)
  - tsconfig.json (strict TypeScript)
  - vitest.config.ts (testing with coverage thresholds)
  - eslint.config.mjs (eslint-config-agent@latest [+ package.json validation if publishable])
  - .prettierrc (formatting)
  - .prettierignore
  - cspell.json (spell checking)
  - knip.json (unused code detection)
  - commitlint.config.mjs (conventional commits)
  - .lintstagedrc.json (staged file linting)
  - .husky/pre-commit (lint-staged on commit)
  - .husky/commit-msg (commit message validation)
  - .husky/pre-push (full checks before push)
  - .gitignore (git exclusions)
  - CONTRIBUTING.md (contribution guidelines)
  - LICENSE (MIT license)
  - README.md (project documentation)
  [- .release-it.json (releases)] - if publishable
  - .github/workflows/ci.yml (CI/CD with coverage reporting)

✅ Dependencies Installed:
  - TypeScript
  - ESLint@latest + eslint-config-agent@latest
  - Prettier
  - cspell + @cspell/dict-he (spell checking with Hebrew support)
  - knip (unused code detection)
  - commitlint + @commitlint/config-conventional (commit message linting)
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
  pnpm knip          - Find unused code
  [pnpm release]     - Create release - if publishable

✅ Git Hooks Configured:
  Pre-commit:  Runs lint-staged (lint, format, spell check staged files)
  Commit-msg:  Validates commit message format (conventional commits)
  Pre-push:    Runs full validation (lint, format, spell, knip, tests)

✅ CI/CD Setup:
  - GitHub Actions workflow configured
  - Tests on Node 20, 22
  - Runs lint, format, spell, test with coverage, build
  - Uploads coverage to Codecov (if token configured)
  [- Auto-publishes to npm on main push with provenance (when version not yet on npm)] - if publishable

⚠️  Next Steps:
  1. [If publishable] Configure OIDC trusted publishing on npmjs.com (no tokens needed)
  2. [Optional] Set up Codecov:
     - Sign up at codecov.io
     - Add repository to Codecov
     - Add CODECOV_TOKEN secret to GitHub
     - Add coverage badge to README.md
  3. Review and customize CONTRIBUTING.md for your project
  4. Customize README.md with actual API usage examples and badges
  5. Verify LICENSE file has correct copyright year and author
  6. Test git hooks (make a commit to test pre-commit, try pushing to test pre-push)
  7. Write your package code in src/
  8. Add tests in `.spec.ts` files next to your logic files (DDD approach)
  9. Maintain 80%+ code coverage (enforced by vitest thresholds)
  10. View coverage reports locally: open coverage/index.html
  11. Update package.json metadata (author, keywords, description, repository URL)
  12. Add project-specific words to cspell.json
  13. Run `pnpm knip` and review/remove unused files, dependencies, and exports
  14. Push to GitHub to trigger CI with coverage reporting
  [15. Run `pnpm release` to publish first version] - if publishable

🚀 Ready to develop!
```

## Important Notes

### For Publishable Packages

1. **npm Publishing via OIDC (Post Dec 2025)**: Classic npm tokens have been permanently revoked. Use OIDC trusted publishing — no secrets needed:

   **Setup**:
   1. Ensure `repository.url` in package.json points to your GitHub repo
   2. Go to npmjs.com > package settings > Trusted Publisher > GitHub Actions
   3. Fill in: org/user, repo name, workflow filename (`ci.yml`)
   4. Click "Set up connection"

   **CI/CD workflow requirements**:
   - `permissions: id-token: write` on the publish job
   - `npm install -g npm@latest` step (OIDC auth requires npm >= 11.5.1)
   - `npm publish --provenance --access public` (use npm directly, not pnpm)
   - Do NOT use `registry-url` in `actions/setup-node` (creates token-based `.npmrc` that overrides OIDC)
   - Do NOT set `NODE_AUTH_TOKEN` env var

   **Fallback** (private packages / self-hosted runners): Create a granular access token on npmjs.com (max 90-day expiration for write), add as `NPM_TOKEN` GitHub secret, and use `registry-url` + `NODE_AUTH_TOKEN` in the workflow.

2. **Initial Version**: Start at `0.0.0` or `0.1.0`, let release-it handle versioning. **For transferred package names**: check `npm view PACKAGE_NAME time --json` to see all historically published versions (including unpublished ones) and pick a version higher than any previously used number

3. **Publishing Workflow**:
   - Develop and commit to feature branches
   - Merge to main (triggers CI)
   - If tests pass AND version is not yet on npm, automatically publishes (also handles first publish)
   - Version must be bumped in package.json for publish to trigger
   - Or use `pnpm release` for manual release with changelog and version bump
   - Publishes include provenance attestation for supply chain security

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

### Using Knip for Code Quality

Knip helps maintain clean codebases by detecting:

1. **Unused Files**: Source files that are never imported
2. **Unused Dependencies**: Packages installed but never used
3. **Unused Exports**: Functions/classes exported but never imported
4. **Duplicate Exports**: Same symbol exported multiple times
5. **Unlisted Dependencies**: Imports without package.json entries

**Running Knip**:

```bash
# Check for unused code
pnpm knip

# Output will show:
# - Unused files (delete or use them)
# - Unused dependencies (remove from package.json)
# - Unused exports (remove or make private)
```

**Common Scenarios**:

- **False Positives**: Add to `ignoreDependencies` in knip.json if a dependency is runtime-only or used dynamically
- **Entry Points**: Update `entry` array if you add new entry points (CLI commands, exported modules)
- **Plugins**: Knip auto-detects vitest, eslint, prettier configs - you don't need to configure them

**Best Practice**: Run `pnpm knip` regularly during development to keep your codebase lean and maintainable.

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
   - Verify OIDC trusted publishing is configured on npmjs.com (Settings > Trusted Publisher > GitHub Actions)
   - Verify `repository.url` in package.json uses `git+https://...git` format (required for provenance verification)
   - Verify `npm install -g npm@latest` step exists (OIDC auth requires npm >= 11.5.1)
   - Verify publish job has `permissions: id-token: write`
   - Do NOT use `registry-url` in `actions/setup-node` (overrides OIDC with token-based auth)
   - Classic npm tokens no longer work (revoked Dec 2025)
   - Check npm package name is available
   - Verify publishConfig.access is correct

5. **Publishing fails with "Cannot publish over previously published version"**:
   - This typically happens with **transferred package names** where the previous owner published and unpublished versions
   - npm permanently blocks re-using any version that was ever published, even after unpublishing
   - `npm view PACKAGE@VERSION` won't find unpublished versions, but `npm publish` still rejects them
   - **Fix**: Run `npm view PACKAGE_NAME time --json` to see ALL historically published versions
   - Choose a version number higher than any previously used version
   - The CI version check uses the `time` field to detect this, but if you set the version manually, check first

6. **Tests fail**:
   - Check vitest.config.ts exists
   - Verify test files match pattern `*.spec.ts`
   - Run locally first: `pnpm test`

7. **Knip reports false positives**:
   - Add runtime-only dependencies to `ignoreDependencies` in knip.json
   - Update `entry` array if you have additional entry points
   - Check if imports are dynamic (use string literals for better detection)
   - Verify entry points match package.json `main`, `bin`, `exports` fields

## Success Criteria

After running this command, the package should:

✅ Have valid package.json with all required fields
✅ Build successfully with `pnpm build`
✅ Pass all tests with `pnpm test`
✅ Pass coverage tests with `pnpm test:coverage`
✅ Meet 80% coverage threshold (lines, functions, branches, statements)
✅ Generate coverage reports (HTML, LCOV, JSON)
✅ Pass linting with `pnpm lint`
✅ Pass formatting checks with `pnpm format:check`
✅ Pass spell checking with `pnpm spell`
✅ Have no unused code (checked with `pnpm knip`)
✅ Have working CI/CD pipeline with coverage reporting
✅ Be ready to publish (if publishable) or use (if internal)

The package is now production-ready with comprehensive test coverage! 🎉
