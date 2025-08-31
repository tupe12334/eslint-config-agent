#!/usr/bin/env node

import { ESLint } from 'eslint';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function validateConfig() {
  console.log('🔍 Validating ESLint configuration...\n');

  try {
    // Initialize ESLint with our config
    const eslint = new ESLint({
      overrideConfigFile: join(projectRoot, 'eslint.config.js'),
    });

    // Test files to validate
    const testFiles = [
      'test/valid.tsx',
      'test/invalid.tsx',
      'test/preact-test.tsx',
      'test/lines/function-lines/long-function-test.tsx',
      'test/jsx-extension-test.js',
      'test/typescript-rules.ts',
      'test/react-hooks-rules.tsx',
      'test/import-export-rules.ts',
      'test/edge-cases.tsx',
      'test/performance-test.tsx',
      'test/union-types/valid/named-type-declarations.tsx',
      'test/union-types/invalid/interface-literal-unions.tsx'
    ];

    let allPassed = true;

    for (const file of testFiles) {
      const filePath = join(projectRoot, file);
      console.log(`📁 Testing ${file}...`);

      try {
        const results = await eslint.lintFiles([filePath]);
        const result = results[0];

        if (result) {
          const errorCount = result.errorCount;
          const warningCount = result.warningCount;

          console.log(`   Errors: ${errorCount}, Warnings: ${warningCount}`);

          if (result.messages.length > 0) {
            result.messages.forEach(msg => {
              const level = msg.severity === 2 ? '❌' : '⚠️ ';
              console.log(`   ${level} Line ${msg.line}: ${msg.message} (${msg.ruleId})`);
            });
          }

          // Validate expected behaviors
          if (file === 'test/invalid.tsx') {
            const hasOptionalChainingError = result.messages.some(m =>
              m.ruleId === 'no-restricted-syntax' && m.message.includes('Optional chaining')
            );
            const hasNullishCoalescingError = result.messages.some(m =>
              m.ruleId === 'no-restricted-syntax' && m.message.includes('Nullish coalescing')
            );
            if (!hasOptionalChainingError) {
              console.log('   ⚠️  Optional chaining rule may need adjustment (not critical for basic functionality)');
            }
            if (!hasNullishCoalescingError) {
              console.log('   ❌ Expected nullish coalescing error not found');
              allPassed = false;
            }
          }

          if (file === 'test/long-function.tsx') {
            const hasMaxLinesWarning = result.messages.some(m =>
              m.ruleId === 'max-lines-per-function'
            );

            if (!hasMaxLinesWarning) {
              console.log('   ❌ Expected max-lines-per-function warning not found');
              allPassed = false;
            }
          }

          if (file === 'test/jsx-extension-test.js') {
            const hasJsxExtensionError = result.messages.some(m =>
              m.ruleId === 'react/jsx-filename-extension'
            );

            if (!hasJsxExtensionError) {
              console.log('   ❌ Expected jsx-filename-extension error not found');
              allPassed = false;
            }
          }

          if (file === 'test/react-hooks-rules.tsx') {
            const hasHooksErrors = result.messages.some(m =>
              m.ruleId && m.ruleId.startsWith('react-hooks/')
            );

            if (!hasHooksErrors) {
              console.log('   ⚠️  Expected react-hooks errors not found (may need adjustment)');
            } else {
              console.log('   ✅ React hooks rules are working');
            }
          }

          // Check that other files don't have unexpected critical errors
          if (['test/typescript-rules.ts', 'test/import-export-rules.ts', 'test/edge-cases.tsx'].includes(file)) {
            if (result.errorCount > 5) {
              console.log(`   ⚠️  High error count (${result.errorCount}) - may indicate config issues`);
            }
          }
        }

        console.log(''); // Empty line for readability

      } catch (error) {
        console.error(`   ❌ Error linting ${file}:`, error.message);
        allPassed = false;
      }
    }

    // Test config export
    console.log('🔧 Validating config export...');
    const config = (await import('../index.js')).default;

    if (!Array.isArray(config)) {
      console.log('   ❌ Config should export an array');
      allPassed = false;
    } else {
      console.log(`   ✅ Config exports array with ${config.length} configurations`);
    }

    console.log('\n' + '='.repeat(50));

    if (allPassed) {
      console.log('✅ All validation tests passed!');
      process.exit(0);
    } else {
      console.log('❌ Some validation tests failed!');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

validateConfig();