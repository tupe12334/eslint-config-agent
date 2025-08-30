# eslint-config-agent

[![npm version](https://badge.fury.io/js/eslint-config-agent.svg)](https://badge.fury.io/js/eslint-config-agent)
[![npm downloads](https://img.shields.io/npm/dm/eslint-config-agent.svg)](https://www.npmjs.com/package/eslint-config-agent)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A comprehensive ESLint configuration package that provides TypeScript, React, and Preact linting rules with strict coding standards designed for enterprise-grade applications and AI-assisted development.

## Why eslint-config-agent?

**Designed for the AI Development Era** 🤖

In an age where AI coding assistants and code generators are increasingly common, maintaining readable and maintainable code becomes critical. This ESLint configuration is specifically designed to prevent AI agents from generating unmaintainable or unreadable code that can leave developers lost in their own codebase.

### Key Benefits

- **🤖 AI-Friendly Rules**: Prevents AI assistants from writing shortcuts that hurt long-term maintainability
- **🔍 Explicit Over Clever**: Forces clear, readable patterns instead of "clever" but obscure code
- **🚀 Production-Ready**: Battle-tested configuration used in production environments  
- **🔒 Type Safety First**: Enforces explicit null/undefined checks instead of optional chaining
- **⚡ Modern ESLint**: Built for ESLint 9+ with flat configuration format
- **🎯 Framework Agnostic**: Works seamlessly with React, Preact, and pure TypeScript
- **📦 Zero Config**: Works out of the box with sensible defaults
- **🔧 Extensible**: Easy to customize and extend for your specific needs

### The Problem with AI-Generated Code

AI coding assistants often generate code that:
- Uses convenient shortcuts like `?.` and `??` that hide potential runtime issues
- Creates complex nested structures that are hard to debug
- Prioritizes brevity over clarity
- Makes assumptions about data structures that may not hold over time

### Our Solution

This configuration enforces patterns that:
- Make null/undefined handling explicit and clear
- Keep functions at manageable lengths (≤100 lines)
- Require proper file organization and naming
- Ensure consistent, readable code structure

## Key Features

- **🛠️ TypeScript First**: Full TypeScript ESLint integration with advanced type checking
- **⚛️ React & Preact**: Complete support for both React and Preact projects
- **🔐 Strict Standards**: Enforces explicit null/undefined checks, disallows optional chaining and nullish coalescing for better code clarity
- **📏 Code Quality**: Function length limits (100 lines), trailing space detection, and consistent formatting
- **🚀 Modern ESLint**: Uses the latest flat configuration format (ESLint 9+)
- **📋 Comprehensive Testing**: 12+ test categories with automated validation
- **🔄 CI/CD Ready**: Zero-warning configuration for production builds

## Installation

### Prerequisites

- **Node.js**: 18.x or higher
- **ESLint**: 9.x
- **TypeScript**: 4.5+ (optional, for TypeScript projects)

### Install the package

```bash
# Using npm
npm install --save-dev eslint-config-agent

# Using pnpm (recommended)
pnpm add -D eslint-config-agent

# Using yarn
yarn add -D eslint-config-agent
```

### Install peer dependencies

The configuration requires several peer dependencies. Install them based on your project needs:

```bash
# Required peer dependencies
npm install --save-dev eslint@^9.34.0 @eslint/js@^9.34.0 @typescript-eslint/eslint-plugin@^8.40.0 @typescript-eslint/parser@^8.40.0 typescript-eslint@^8.40.0 eslint-plugin-react@^7.37.5 eslint-plugin-react-hooks@^5.2.0 eslint-plugin-import@^2.32.0 globals@^16.3.0 @eslint/eslintrc@^3.3.1

# For Preact projects (optional)
npm install --save-dev eslint-plugin-preact@^0.1.0
```

Or use your package manager's peer dependency command:

```bash
# Auto-install peer dependencies with npm 7+
npx install-peerdeps --dev eslint-config-agent

# With pnpm
pnpm install --save-dev $(pnpm info eslint-config-agent peerDependencies --json | jq -r 'to_entries[] | "\(.key)@\(.value)"')
```

## Usage

### Quick Start

Create an `eslint.config.js` file in your project root:

```javascript
import config from 'eslint-config-agent';

export default config;
```

### Advanced Configuration

#### Extending with Custom Rules

```javascript
import baseConfig from 'eslint-config-agent';

export default [
  ...baseConfig,
  {
    rules: {
      // Override or add your custom rules
      'no-console': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
];
```

#### Project-Specific Ignores

```javascript
import baseConfig from 'eslint-config-agent';

export default [
  ...baseConfig,
  {
    ignores: [
      'build/**',
      'dist/**',
      'coverage/**',
      '*.config.js',
    ],
  },
];
```

#### File-Specific Overrides

```javascript
import baseConfig from 'eslint-config-agent';

export default [
  ...baseConfig,
  {
    files: ['**/*.test.{ts,tsx,js,jsx}'],
    rules: {
      // Relax rules for test files
      'max-lines-per-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
];
```

### Integration with Popular Tools

#### VS Code Setup

Add to your `.vscode/settings.json`:

```json
{
  "eslint.enable": true,
  "eslint.format.enable": true,
  "eslint.useFlatConfig": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

#### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "lint:ci": "eslint . --max-warnings 0"
  }
}
```

## Rules & Configuration

### Core Philosophy

This ESLint configuration prioritizes **explicit code** over convenient shortcuts, especially important when working with AI coding assistants. Instead of allowing potentially unsafe operations like optional chaining, it enforces explicit null/undefined checks that make your intentions clear and your code more maintainable.

**Why This Matters for AI Development:**
- **🧠 Human-Readable**: Code that humans can easily understand and modify
- **🔍 Debuggable**: Clear error paths and explicit state handling  
- **📚 Self-Documenting**: Code that explains its intent without extensive comments
- **🛠️ Maintainable**: Patterns that remain clear even as the codebase grows

### Key Rules Enforced

#### Type Safety Rules
- **🚫 No Optional Chaining** (`?.`): Forces explicit null/undefined checks
  ```typescript
  // ❌ Avoid
  const name = user?.profile?.name;
  
  // ✅ Preferred
  const name = user && user.profile ? user.profile.name : undefined;
  ```

- **🚫 No Nullish Coalescing** (`??`): Use explicit checks instead
  ```typescript
  // ❌ Avoid
  const name = userName ?? 'Anonymous';
  
  // ✅ Preferred
  const name = userName !== null && userName !== undefined ? userName : 'Anonymous';
  ```

#### File Organization Rules
- **📁 JSX File Extensions**: JSX syntax only allowed in `.tsx` and `.jsx` files
- **📏 Function Length**: Maximum 100 lines per function (warning level)
- **🧹 No Trailing Spaces**: Enforces clean, consistent formatting

#### React & TypeScript Rules
- **⚛️ React Hooks**: Full enforcement of hooks rules and dependency arrays
- **🔤 TypeScript**: Strict type checking with explicit type assertions
- **📦 Import/Export**: Consistent module patterns and import ordering

### Supported File Types & Configurations

| File Pattern | Parser | Plugins | Environment |
|--------------|---------|---------|-------------|
| `**/*.ts` | TypeScript | TypeScript ESLint | Browser |
| `**/*.tsx` | TypeScript | TypeScript, React, React Hooks | Browser + JSX |
| `**/*.js` | JavaScript | Import | Browser |
| `**/*.jsx` | JavaScript | React, React Hooks, Import | Browser + JSX |
| `scripts/**/*.js` | JavaScript | - | Node.js |

### Framework-Specific Features

#### React Support
- React 17+ automatic JSX runtime support
- Comprehensive hooks validation (rules-of-hooks, exhaustive-deps)
- Component prop validation
- JSX accessibility hints

#### Preact Support (Optional)
- Automatic detection and configuration when `eslint-plugin-preact` is installed
- Compatible with Preact-specific patterns and optimizations
- Shared configuration with React rules where applicable

### Rule Categories

#### **Enabled Rules** (Errors & Warnings)
- TypeScript strict type checking
- React hooks validation
- Import/export consistency  
- Function complexity limits
- Whitespace and formatting

#### **Disabled Rules**
Many common ESLint and React rules are intentionally disabled to reduce noise while focusing on the most impactful code quality issues:
- `react/react-in-jsx-scope` (not needed with modern React)
- `@typescript-eslint/no-unused-vars` (TypeScript handles this)
- `no-undef` (TypeScript handles this)
- Plus 50+ other rules optimized for developer productivity

## Migration Guide

### From Legacy .eslintrc Configuration

If you're migrating from an older ESLint configuration, here's how to transition:

#### 1. Remove Old Configuration Files
```bash
# Remove old config files
rm .eslintrc.js .eslintrc.json .eslintrc.yml .eslintrc
```

#### 2. Update Package Dependencies
```bash
# Remove old ESLint packages (if present)
npm uninstall @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-react-app

# Install eslint-config-agent and required peer dependencies
npm install --save-dev eslint-config-agent
# ... (see Installation section for full peer dependencies)
```

#### 3. Create New Flat Configuration
Replace your old configuration with:

```javascript
// eslint.config.js
import config from 'eslint-config-agent';

export default config;
```

#### 4. Update Scripts
Update your package.json scripts to use the flat config:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### From Create React App

If migrating from Create React App's ESLint configuration:

```javascript
// Replace react-scripts ESLint config
import config from 'eslint-config-agent';

export default [
  ...config,
  {
    // Add any CRA-specific overrides you need
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Custom rules for your React app
    }
  }
];
```

### From Airbnb Config

Transitioning from Airbnb's ESLint config:

```javascript
import config from 'eslint-config-agent';

export default [
  ...config,
  {
    // Airbnb users might want these additional rules
    rules: {
      'import/prefer-default-export': 'warn',
      'class-methods-use-this': 'warn',
    }
  }
];
```

## Troubleshooting & FAQ

### Common Issues

#### "Cannot find module 'eslint-config-agent'"
**Solution:** Ensure the package is installed correctly:
```bash
npm ls eslint-config-agent
# If not found, reinstall:
npm install --save-dev eslint-config-agent
```

#### "Parsing error: Cannot find module '@typescript-eslint/parser'"
**Solution:** Install all required peer dependencies:
```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

#### ESLint flat config not recognized
**Solution:** Ensure you're using ESLint 9+ and your config file is named `eslint.config.js`:
```bash
npm ls eslint
# Upgrade if needed:
npm install --save-dev eslint@^9.34.0
```

#### VS Code not using flat config
**Solution:** Add to your VS Code settings:
```json
{
  "eslint.useFlatConfig": true
}
```

### Frequently Asked Questions

#### **Q: Why are optional chaining and nullish coalescing disabled?**
A: These features, while convenient, can hide potential runtime errors. Explicit null checks make your code's intention clearer and prevent unexpected behavior when dealing with complex nested objects.

#### **Q: Can I enable optional chaining for specific files?**
A: Yes! Use file-specific overrides:
```javascript
export default [
  ...config,
  {
    files: ['src/legacy/**/*.ts'],
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
    }
  }
];
```

#### **Q: How do I handle large existing codebases?**
A: Start with warnings instead of errors:
```javascript
export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
    }
  }
];
```

#### **Q: Does this work with monorepos?**
A: Yes! Place the `eslint.config.js` at the root of each package, or use a shared config:
```javascript
// packages/shared/eslint.config.js
import baseConfig from 'eslint-config-agent';
export default baseConfig;

// packages/frontend/eslint.config.js
import sharedConfig from '../shared/eslint.config.js';
export default sharedConfig;
```

#### **Q: How does this help with AI coding assistants like GitHub Copilot, Claude, or ChatGPT?**
A: This configuration prevents AI assistants from generating "convenient" but problematic code patterns:

- **🚫 Prevents**: AI generating `user?.profile?.name` shortcuts
- **✅ Enforces**: AI writing `user && user.profile ? user.profile.name : undefined`  
- **🚫 Prevents**: AI using `value ?? fallback` patterns
- **✅ Enforces**: AI writing explicit null/undefined checks
- **📏 Limits**: Function length so AI doesn't generate massive functions
- **🗂️ Organizes**: File structure so AI puts JSX only in proper file extensions

This means you get AI assistance while maintaining code that you can actually understand and debug months later.

#### **Q: How do I contribute or report issues?**
A: Please use the [GitHub repository](https://github.com/tupe12334/eslint-config) for issues and contributions.

## Development & Contributing

### Getting Started

#### Prerequisites for Development
- Node.js 18+ 
- pnpm (recommended package manager)
- Git

#### Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/tupe12334/eslint-config.git
cd eslint-config

# Install dependencies
pnpm install

# Run tests to verify setup
pnpm test
```

### Testing & Validation

The package includes comprehensive testing infrastructure with 12+ test categories:

#### **Available Test Commands**
```bash
# 🧪 Run comprehensive test suite with detailed reporting
pnpm test

# 🎯 Test specific categories  
pnpm test:valid          # Valid code that should pass linting
pnpm test:invalid        # Invalid code that should trigger errors
pnpm test:hooks          # React hooks validation rules
pnpm test:imports        # Import/export pattern validation
pnpm test:edge           # Edge cases and boundary conditions
pnpm test:performance    # Large files and complex scenarios

# 🔍 Additional validation
pnpm validate            # Legacy configuration validator
pnpm lint                # Lint the entire project
pnpm test:ci            # CI-ready linting (zero warnings allowed)
```

#### **Test Categories & Coverage**

| Category | Files | Purpose |
|----------|--------|---------|
| **Valid Code** | `valid.tsx`, `preact-test.tsx` | Code that should pass with minimal warnings |
| **Invalid Code** | `invalid.tsx`, `jsx-extension-test.js` | Code that should trigger specific errors |
| **Function Limits** | `long-function.tsx` | Test function length restrictions |
| **React Hooks** | `react-hooks-rules.tsx` | Validate hooks rules and dependency arrays |  
| **TypeScript** | `typescript-rules.ts` | TypeScript-specific features and rules |
| **Imports** | `import-export-rules.ts` | Module import/export patterns |
| **Edge Cases** | `edge-cases.tsx` | Boundary conditions and complex JSX |
| **Performance** | `performance-test.tsx` | Large files and complex components |

#### **Test Infrastructure**
- **`scripts/test-runner.js`**: Main test runner with categorized validation, statistics, and detailed reporting
- **`scripts/validate-config.js`**: Legacy configuration validator for basic functionality
- **Automated CI/CD**: GitHub Actions integration for continuous testing

### Contributing

#### **Contribution Guidelines**
1. **Fork and Clone**: Fork the repository and create a feature branch
2. **Follow Conventions**: Use conventional commit messages (`feat:`, `fix:`, `docs:`, etc.)
3. **Add Tests**: Include tests for new features or rule changes
4. **Update Documentation**: Update README.md if adding new features
5. **Test Thoroughly**: Run `pnpm test && pnpm test:ci` before submitting

#### **Pull Request Process**
1. Ensure all tests pass locally
2. Update documentation for any new features  
3. Add test cases for new rules or configurations
4. Submit PR with clear description of changes
5. Respond to code review feedback

#### **Reporting Issues**
- Use GitHub Issues for bug reports and feature requests
- Include ESLint version, Node.js version, and reproduction steps
- Provide minimal reproduction case when possible

### Architecture & Design Decisions

#### **Configuration Philosophy**
- **AI-Era Development**: Designed for maintainable AI-assisted coding
- **Explicit over Implicit**: Prefer explicit null checks over optional chaining  
- **Human-Readable First**: Prioritize code clarity over brevity
- **Long-term Maintainability**: Prevent AI from writing "clever" but unmaintainable code
- **Productivity focused**: Disable noisy rules that don't add value
- **Framework agnostic**: Support React, Preact, and pure TypeScript equally
- **Modern tooling**: Built for ESLint 9+ flat configuration

#### **Key Design Choices**
- Flat configuration format for better composability
- Conditional plugin loading for optional dependencies (Preact)
- Separate configurations for different file types and environments
- Comprehensive testing to prevent regressions

## Supported File Types & Environments

| File Extension | Framework | Environment | Parser |
|----------------|-----------|-------------|---------|
| `.ts` | TypeScript | Browser | @typescript-eslint/parser |
| `.tsx` | TypeScript + React/Preact | Browser + JSX | @typescript-eslint/parser |
| `.js` | JavaScript | Browser | ESLint default |
| `.jsx` | JavaScript + React/Preact | Browser + JSX | ESLint default |
| `scripts/**/*.js` | Node.js scripts | Node.js | ESLint default |

## Version History & Changelog

### Latest Release: v1.0.5

#### **v1.0.5** (Latest)
- Enhanced ESLint rules for optional chaining and member expressions
- Updated documentation with comprehensive usage examples
- Improved test coverage and validation scripts

#### **v1.0.4** 
- Enhanced type assertion rules and test coverage
- Updated ESLint rules for invalid TypeScript patterns
- Improved documentation and release management

#### Previous Versions
- **v1.0.3**: Enhanced React hooks rules and dependency validation
- **v1.0.2**: Added comprehensive TypeScript support
- **v1.0.1**: Initial React and Preact support
- **v1.0.0**: Initial release with basic ESLint configuration

For detailed changelog information, see the [releases page](https://github.com/tupe12334/eslint-config/releases).

## Dependencies & Peer Requirements

### **Required Peer Dependencies**
| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | `^9.34.0` | Core ESLint engine |
| `@typescript-eslint/parser` | `^8.40.0` | TypeScript parsing |
| `@typescript-eslint/eslint-plugin` | `^8.40.0` | TypeScript rules |
| `eslint-plugin-react` | `^7.37.5` | React-specific rules |
| `eslint-plugin-react-hooks` | `^5.2.0` | React hooks validation |
| `eslint-plugin-import` | `^2.32.0` | Import/export rules |

### **Optional Dependencies**
| Package | Version | Purpose |
|---------|---------|---------|
| `eslint-plugin-preact` | `^0.1.0` | Preact-specific optimizations |

## License

**ISC License** - See [LICENSE](LICENSE) file for details.

## Links & Resources

- **📦 [npm Package](https://www.npmjs.com/package/eslint-config-agent)**
- **🐙 [GitHub Repository](https://github.com/tupe12334/eslint-config)**  
- **📋 [Issues & Bug Reports](https://github.com/tupe12334/eslint-config/issues)**
- **🔄 [Releases & Changelog](https://github.com/tupe12334/eslint-config/releases)**
- **📖 [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files)**

---

Made with ❤️ by the eslint-config-agent team. Contributions welcome!