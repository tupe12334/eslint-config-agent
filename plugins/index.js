/**
 * Centralized Plugin Aggregation
 *
 * This file aggregates all ESLint plugins used across the configuration
 * to ensure consistent plugin registration across all config files.
 */

import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import importPlugin from 'eslint-plugin-import'
import securityPlugin from 'eslint-plugin-security'
import nPlugin from 'eslint-plugin-n'
import classExportPlugin from 'eslint-plugin-class-export'
import singleExportPlugin from 'eslint-plugin-single-export'
import requiredExportsPlugin from 'eslint-plugin-required-exports'
import storybookPlugin from 'eslint-plugin-storybook'
import errorPlugin from 'eslint-plugin-error'
import defaultPlugin from 'eslint-plugin-default'
import dddPlugin from 'eslint-plugin-ddd'
import preactPlugin from 'eslint-plugin-preact'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import unicornPlugin from 'eslint-plugin-unicorn'
import { noDefaultClassExportRule } from '../rules/no-default-class-export/index.js'
import { requireSpecFileTsxRule } from '../rules/require-spec-file-tsx/index.js'

// Centralized plugin configuration
export const plugins = {
  react: reactPlugin,
  'react-hooks': reactHooksPlugin,
  import: importPlugin,
  security: securityPlugin,
  n: nPlugin,
  'class-export': classExportPlugin,
  'single-export': singleExportPlugin,
  'required-exports': requiredExportsPlugin,
  storybook: storybookPlugin,
  error: errorPlugin,
  default: defaultPlugin,
  ddd: dddPlugin,
  preact: preactPlugin,
  'unused-imports': unusedImportsPlugin,
  unicorn: unicornPlugin,
  custom: {
    rules: {
      'no-default-class-export': noDefaultClassExportRule,
      'require-spec-file-tsx': requireSpecFileTsxRule,
    },
  },
}
