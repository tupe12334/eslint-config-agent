import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import preactPlugin from 'eslint-plugin-preact';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPlugin from 'eslint-plugin-react';
import globals from 'globals';

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
});

const config = [
  reactHooks.configs['recommended-latest'],
  {
    ignores: ['packages/auth-service-sdk/**'],
  },
  js.configs.recommended,

  // Node.js files
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // TypeScript and TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'pnpm-lock.yaml',
      'packages/auth-service-sdk/**',
      'packages/auth-service-sdk/src/core/**',
      'packages/auth-service-sdk/src/client/**',
      'packages/auth-service-sdk/src/*.gen.ts',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      preact: preactPlugin,
      react: reactPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'no-undef': 'off',
      'import/extensions': ['off'],
      'import/no-extraneous-dependencies': ['off'],
      'react/self-closing-comp': 'off',
      'object-curly-newline': 'off',
      'import/no-unresolved': 'off',
      'import/no-absolute-path': 'off',
      'no-shadow': 'off',
      'react/destructuring-assignment': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/button-has-type': 'off',
      'import/order': 'off',
      'comma-dangle': 'off',
      'function-paren-newline': 'off',
      quotes: 'off',
      'no-unused-vars': 'off',
      'import/newline-after-import': 'off',
      'import/first': 'off',
      'import/prefer-default-export': 'off',
      'react/react-in-jsx-scope': 'off',
      'max-lines-per-function': [
        'warn',
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
      semi: 'off',
      'react/function-component-definition': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/no-unknown-property': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/require-default-props': 'off',
      complexity: 'off',
      'no-trailing-spaces': 'warn',
      'operator-linebreak': 'off',
      'implicit-arrow-linebreak': 'off',
      'react/jsx-wrap-multilines': 'off',
      'arrow-body-style': 'off',
      'react/jsx-closing-bracket-location': 'off',
      'no-continue': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'OptionalMemberExpression',
          message: 'Optional chaining is not allowed.',
        },
        {
          selector: 'OptionalCallExpression',
          message: 'Optional chaining is not allowed.',
        },
        {
          selector: 'LogicalExpression[operator="??"]',
          message: 'Nullish coalescing operator (??) is not allowed. Use explicit null/undefined checks instead.',
        },
      ],
      'jsx-a11y/label-has-associated-control': 'off',
      'react/jsx-no-useless-fragment': 'off',
    },
  },

  // JavaScript and JSX files
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'pnpm-lock.yaml',
      'packages/auth-service-sdk/**',
      '**/*.umd.js',
      '**/*.cjs',
      '**/*.mjs',
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      preact: preactPlugin,
      react: reactPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'import/extensions': ['off'],
      'import/no-extraneous-dependencies': ['off'],
      'react/self-closing-comp': 'off',
      'object-curly-newline': 'off',
      'import/no-unresolved': 'off',
      'import/no-absolute-path': 'off',
      'no-shadow': 'off',
      'react/destructuring-assignment': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/button-has-type': 'off',
      'import/order': 'off',
      'comma-dangle': 'off',
      'function-paren-newline': 'off',
      quotes: 'off',
      'no-unused-vars': 'off',
      'import/newline-after-import': 'off',
      'import/first': 'off',
      'import/prefer-default-export': 'off',
      'react/react-in-jsx-scope': 'off',
      'max-lines-per-function': [
        'warn',
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
      semi: 'off',
      'react/function-component-definition': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/no-unknown-property': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/require-default-props': 'off',
      complexity: 'off',
      'no-trailing-spaces': 'warn',
      'operator-linebreak': 'off',
      'implicit-arrow-linebreak': 'off',
      'react/jsx-wrap-multilines': 'off',
      'arrow-body-style': 'off',
      'react/jsx-closing-bracket-location': 'off',
      'no-continue': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'OptionalMemberExpression',
          message: 'Optional chaining is not allowed.',
        },
        {
          selector: 'OptionalCallExpression',
          message: 'Optional chaining is not allowed.',
        },
        {
          selector: 'LogicalExpression[operator="??"]',
          message: 'Nullish coalescing operator (??) is not allowed. Use explicit null/undefined checks instead.',
        },
      ],
      'jsx-a11y/label-has-associated-control': 'off',
      'react/jsx-no-useless-fragment': 'off',
    },
  },
];

export default config;