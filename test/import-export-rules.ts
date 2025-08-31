// Import/Export rules testing

// Named imports (should be allowed)
import { useState, useEffect } from 'react';
import { Component } from 'preact';

// Default import (should be allowed since import/prefer-default-export is off)
import React from 'react';

// Type-only imports
import type { ReactNode } from 'react';

// Multiple imports from same module
import fs from 'fs';
import path from 'path';

// Named exports (should be allowed)
export const utilityFunction = () => 'test';
export const anotherFunction = () => 'test2';

// Re-exports are now allowed (single named re-exports)
export { useState } from 'react';
export type { ReactNode } from 'react';

// Main function as named export (no default exports allowed)
export function MainFunction() {
  return 'main';
}

// Namespace import
import * as utils from './typescript-rules';

// Dynamic import in async function
async function loadModule() {
  const module = await import('./valid');
  return module.ValidComponent;
}

// Interface export
export interface TestConfig {
  name: string;
  enabled: boolean;
}

// Type alias export
export type Status = 'active' | 'inactive';

// Const assertion export
export const config = {
  api: 'https://example.com',
  timeout: 5000,
} as const;

// Function with type parameters
export function identity<T>(arg: T): T {
  return arg;
}

// Class export
export class TestService {
  private config: TestConfig;

  constructor(config: TestConfig) {
    this.config = config;
  }

  getStatus(): Status {
    return this.config.enabled ? 'active' : 'inactive';
  }
}

// Mixed exports (this should be fine since import/prefer-default-export is off)
const helper1 = () => 'helper1';
const helper2 = () => 'helper2';

export { helper1, helper2 };

// Test that these work with the disabled import rules
// These should NOT cause errors since the rules are turned off:
// - import/extensions
// - import/no-extraneous-dependencies
// - import/no-unresolved
// - import/no-absolute-path
// - import/order
// - import/newline-after-import
// - import/first
// - import/prefer-default-export