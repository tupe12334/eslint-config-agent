# Contributing to eslint-config-agent

Thank you for your interest in contributing to eslint-config-agent! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites for Development

- Node.js 18+
- pnpm (recommended package manager)
- Git

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/tupe12334/eslint-config.git
cd eslint-config

# Install dependencies
pnpm install

# Run tests to verify setup
pnpm test
```

## Testing & Validation

The package includes comprehensive testing infrastructure with 12+ test categories:

### Available Test Commands

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

### Test Categories & Coverage

| Category            | Files                                  | Purpose                                     |
| ------------------- | -------------------------------------- | ------------------------------------------- |
| **Valid Code**      | `valid.tsx`, `preact-test.tsx`         | Code that should pass with minimal warnings |
| **Invalid Code**    | `invalid.tsx`, `jsx-extension-test.js` | Code that should trigger specific errors    |
| **Function Limits** | `long-function.tsx`                    | Test function length restrictions           |
| **React Hooks**     | `react-hooks-rules.tsx`                | Validate hooks rules and dependency arrays  |
| **TypeScript**      | `typescript-rules.ts`                  | TypeScript-specific features and rules      |
| **Imports**         | `import-export-rules.ts`               | Module import/export patterns               |
| **Edge Cases**      | `edge-cases.tsx`                       | Boundary conditions and complex JSX         |
| **Performance**     | `performance-test.tsx`                 | Large files and complex components          |

### Test Infrastructure

- **`scripts/test-runner.js`**: Main test runner with categorized validation, statistics, and detailed reporting
- **`scripts/validate-config.js`**: Legacy configuration validator for basic functionality
- **Automated CI/CD**: GitHub Actions integration for continuous testing

## Contributing Guidelines

### Contribution Process

1. **Fork and Clone**: Fork the repository and create a feature branch
2. **Follow Conventions**: Use conventional commit messages (`feat:`, `fix:`, `docs:`, etc.)
3. **Add Tests**: Include tests for new features or rule changes
4. **Update Documentation**: Update README.md if adding new features
5. **Test Thoroughly**: Run `pnpm test && pnpm test:ci` before submitting

### Pull Request Process

1. Ensure all tests pass locally
2. Update documentation for any new features
3. Add test cases for new rules or configurations
4. Submit PR with clear description of changes
5. Respond to code review feedback

### Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include ESLint version, Node.js version, and reproduction steps
- Provide minimal reproduction case when possible

## Architecture & Design Decisions

### Configuration Philosophy

- **AI-Era Development**: Designed for maintainable AI-assisted coding
- **Explicit over Implicit**: Prefer explicit null checks over optional chaining
- **Human-Readable First**: Prioritize code clarity over brevity
- **Long-term Maintainability**: Prevent AI from writing "clever" but unmaintainable code
- **Productivity focused**: Disable noisy rules that don't add value
- **Framework agnostic**: Support React, Preact, and pure TypeScript equally
- **Modern tooling**: Built for ESLint 9+ flat configuration

### Key Design Choices

- Flat configuration format for better composability
- Conditional plugin loading for optional dependencies (Preact)
- Separate configurations for different file types and environments
- Comprehensive testing to prevent regressions

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for all contributors. Please be respectful and considerate in all interactions.

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Check existing issues and discussions
- Reach out to the maintainers

Thank you for contributing to eslint-config-agent!
