/**
 * Centralized Plugin Aggregation
 *
 * This file aggregates all ESLint plugins used across the configuration
 * to ensure consistent plugin registration across all config files.
 */

import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import securityPlugin from 'eslint-plugin-security'
import nPlugin from 'eslint-plugin-n'
import classExportPlugin from 'eslint-plugin-class-export'
import singleExportPlugin from 'eslint-plugin-single-export'
import requiredExportsPlugin from 'eslint-plugin-required-exports'
import storybookPlugin from 'eslint-plugin-storybook'
import errorPlugin from 'eslint-plugin-error'
import defaultPlugin from 'eslint-plugin-default'
import noOptionalChainingPlugin from 'eslint-plugin-no-optional-chaining'
import dddPlugin from 'eslint-plugin-ddd'
import preactPlugin from 'eslint-plugin-preact'
import allRules from '../rules/index.js'
import { noDefaultClassExportRule } from '../rules/no-default-class-export/index.js'

// Centralized plugin configuration
export const plugins = {
  react: reactPlugin,
  import: importPlugin,
  security: securityPlugin,
  n: nPlugin,
  'class-export': classExportPlugin,
  'single-export': singleExportPlugin,
  'required-exports': requiredExportsPlugin,
  storybook: storybookPlugin,
  error: errorPlugin,
  default: defaultPlugin,
  'no-optional-chaining': noOptionalChainingPlugin,
  ddd: dddPlugin,
  preact: preactPlugin,
  custom: {
    rules: {
      'no-default-class-export': noDefaultClassExportRule,
      'jsx-classname-required': allRules.jsxClassNameRequiredRule,
    },
  },
}
