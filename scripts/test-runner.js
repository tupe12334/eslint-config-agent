#!/usr/bin/env node

import { ESLint } from "eslint";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readdir, stat } from "fs/promises";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

// Test categories and their expected behaviors
const testCategories = {
  valid: {
    description: "Files that should have minimal or no errors",
    files: [
      "test/valid.tsx",
      "test/preact-test.tsx",
      "test/typescript-rules.ts",
      "test/type-assertions/indexed-access-valid.ts",
    ],
    maxErrors: 0,
    maxWarnings: 10,
  },
  invalid: {
    description: "Files that should trigger specific errors",
    files: [
      "test/invalid.tsx",
      "test/jsx-extension-test.js",
    ],
    maxErrors: 7,
    maxWarnings: 6,
    expectedRules: ["no-restricted-syntax", "no-optional-chaining/no-optional-chaining", "react/jsx-filename-extension", "custom/jsx-classname-required", "@typescript-eslint/no-explicit-any"],
  },
  "type-assertions-indexed": {
    description: "Indexed access type assertion restrictions",
    files: ["test/type-assertions/indexed-access-invalid.ts"],
    maxErrors: 10,
    maxWarnings: 0,
    expectedRules: ["no-restricted-syntax"],
  },
  warnings: {
    description: "Files that should trigger warnings",
    files: ["test/lines/function-lines/long-function-test.tsx"],
    maxErrors: 6,
    maxWarnings: 5,
    expectedRules: ["max-lines-per-function", "no-restricted-syntax"],
  },
  hooks: {
    description: "React hooks rules testing",
    files: ["test/react-hooks-rules.tsx"],
    maxErrors: 10,
    maxWarnings: 20,
    expectedRules: [
      "react-hooks/exhaustive-deps",
      "react-hooks/rules-of-hooks",
    ],
  },
  imports: {
    description: "Import/export patterns testing",
    files: ["test/import-export-rules.ts"],
    maxErrors: 13, // import/group-exports + import/no-namespace + import/first errors + export specifier rules
    maxWarnings: 0,
    expectedRules: ["import/group-exports", "import/no-namespace", "import/first"],
  },
  "edge-cases": {
    description: "Edge cases and boundary testing",
    files: ["test/edge-cases.tsx"],
    maxErrors: 30,
    maxWarnings: 30,
    expectedRules: ["no-restricted-syntax", "max-lines", "@typescript-eslint/no-explicit-any"],
  },
  performance: {
    description: "Performance and large file testing",
    files: ["test/performance-test.tsx"],
    maxErrors: 47,
    maxWarnings: 35,
    expectedRules: ["max-lines-per-function", "max-lines", "no-restricted-syntax", "@typescript-eslint/no-explicit-any", "error/no-generic-error", "error/require-custom-error"],
  },
  "export-valid": {
    description: "Valid export patterns",
    files: [
      "test/export/valid/single-named-export.ts",
      "test/export/valid/single-function-export.ts",
      "test/export/valid/single-class-export.ts",
      "test/export/valid/single-interface-export.ts",
      "test/export/valid/single-type-export.ts",
      "test/export/valid/single-re-export.ts",
      "test/export/valid/single-type-re-export.ts",
      "test/export/valid/single-as-const-export.ts",
      "test/export/valid/multiple-re-exports.ts",
      "test/export/valid/jsx-component-with-props.jsx",
      "test/export/valid/tsx-component-with-props.tsx",
      "test/export/valid/tsx-component-with-type.tsx",
      "test/export/valid/tsx-class-component-with-props.tsx",
      "test/export/valid/tsx-multiple-individual-exports.tsx",
      "test/export/valid/tsx-export-statement.tsx",
      "test/export/valid/jsx-export-statement.jsx",
      "test/export/valid/export-type-re-export.ts",
      "test/export/valid/regular-type-export.ts",
      "test/export/valid/explicit-export-declaration.ts",
      "test/export/valid/export-from-scoped.ts",
    ],
    maxErrors: 0,
    maxWarnings: 5,
  },
  "export-invalid": {
    description: "Invalid export patterns",
    files: [
      "test/export/invalid/default-export.ts",
      "test/export/invalid/default-class-export.ts",
      "test/export/invalid/multiple-named-exports.ts",
      "test/export/invalid/multiple-export-statements.ts",
      "test/export/invalid/two-export-statements.ts",
      "test/export/invalid/export-star.ts",
      "test/export/invalid/export-star-as.ts",
      "test/export/invalid/mixed-exports.ts",
      "test/export/invalid/default-with-named.ts",
      "test/export/invalid/export-type-local.ts",
      "test/export/invalid/regular-export-specifiers.ts",
      "test/export/invalid/default-as-export.ts",
      "test/export/invalid/export-of-import.ts",
      "test/export/invalid/export-from-lib.ts",
    ],
    maxErrors: 17, // class-export/class-export + remaining no-restricted-syntax + export specifier rules + single-export rules
    maxWarnings: 0,
    expectedRules: ["no-restricted-syntax", "class-export/class-export", "single-export/single-export"],
  },
  "index-files-valid": {
    description: "Valid index file patterns",
    files: [
      "test/index-files/valid/index.ts",
      "test/index-files/valid/index-re-exports.ts",
    ],
    maxErrors: 0,
    maxWarnings: 2,
  },
  "index-files-invalid": {
    description: "Invalid index file patterns",
    files: [
      "test/index-files/invalid/index.ts",
      "test/index-files/invalid/index-multiple-statements.ts",
      "test/index-files/invalid/index-export-specifiers.js",
    ],
    maxErrors: 4,
    maxWarnings: 2,
    expectedRules: ["no-restricted-syntax"],
  },
  "switch-case-valid": {
    description: "Valid switch case patterns",
    files: [
      "test/switch-case/valid/explicit-returns.tsx",
      "test/switch-case/valid/typed-functions.tsx",
      "test/switch-case/valid/function-return-types.tsx",
    ],
    maxErrors: 0,
    maxWarnings: 0,
    expectedRules: ["no-restricted-syntax"],
  },
  "switch-case-invalid": {
    description: "Invalid switch case patterns",
    files: [
      "test/switch-case/invalid/default-cases.tsx",
      "test/switch-case/invalid/empty-returns.tsx",
      "test/switch-case/invalid/missing-function-return-types.tsx",
      "test/switch-case/invalid/untyped-functions.tsx",
    ],
    maxErrors: 29,
    maxWarnings: 0,
    expectedRules: ["no-restricted-syntax"],
  },
  "optional-chaining": {
    description: "Optional chaining and nullish coalescing tests",
    files: ["test/test-optional.ts", "test/test-js-optional.js"],
    maxErrors: 7,
    maxWarnings: 0,
    expectedRules: ["no-restricted-syntax"],
  },
  "classname-tests": {
    description: "className attribute tests",
    files: [
      "test/classname-warning-test.tsx",
      "test/classname-warning-test.jsx",
    ],
    maxErrors: 50,
    maxWarnings: 0,
    expectedRules: ["custom/jsx-classname-required"],
  },
  "classname-valid": {
    description: "Valid className usage - should have no errors",
    files: [
      "test/classname/valid/valid-classname.tsx",
      "test/classname/valid/valid-classname.jsx",
      "test/classname/valid/edge-cases-valid.tsx",
      "test/classname/valid/forms-fragments-valid.tsx",
      "test/classname/valid/react-components-valid.tsx",
    ],
    maxErrors: 9,
    maxWarnings: 0,
    expectedRules: ["custom/jsx-classname-required"],
  },
  "classname-invalid": {
    description: "Invalid className usage - should trigger errors",
    files: [
      "test/classname/invalid/invalid-classname.tsx",
      "test/classname/invalid/invalid-classname.jsx",
      "test/classname/invalid/edge-cases-invalid.tsx",
      "test/classname/invalid/forms-fragments-invalid.tsx",
      "test/classname/invalid/react-components-invalid.tsx",
    ],
    maxErrors: 164,
    maxWarnings: 0,
    expectedRules: ["custom/jsx-classname-required"],
  },
  "spec-test-files": {
    description: "Test and spec file patterns",
    files: [
      "test/lines/file-lines/max-lines-test-files.test.tsx",
      "test/lines/file-lines/max-lines-spec-files.spec.js",
    ],
    maxErrors: 12,
    maxWarnings: 0,
    expectedRules: ["no-undef", "max-lines-per-function", "max-lines", "no-restricted-syntax"],
  },
  "record-literals": {
    description: "Record literal type tests",
    files: ["test/test-record-literals.ts"],
    maxErrors: 12,
    maxWarnings: 0,
    expectedRules: ["@typescript-eslint/no-explicit-any"],
  },
  "no-env-access": {
    description: "n/no-process-env rule tests",
    files: ["test/no-env-access-test.ts"],
    maxErrors: 3,
    maxWarnings: 0,
    expectedRules: ["n/no-process-env"],
  },
};

async function findTestFiles() {
  const files = [];

  // Recursively check test/ directory
  async function scanDirectory(dirPath, relativePath) {
    try {
      const entries = await readdir(dirPath);

      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = await stat(fullPath);
        const relativeFilePath = join(relativePath, entry);

        if (stats.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry)) {
          files.push(relativeFilePath);
        } else if (stats.isDirectory()) {
          await scanDirectory(fullPath, relativeFilePath);
        }
      }
    } catch (error) {
      console.warn(
        `⚠️  Could not read directory ${relativePath}:`,
        error.message
      );
    }
  }

  await scanDirectory(join(projectRoot, "test"), "test");

  // Scan rules directory for spec files only
  async function scanRulesForSpecs(rulesPath, relativePath) {
    try {
      const entries = await readdir(rulesPath);

      for (const entry of entries) {
        const fullPath = join(rulesPath, entry);
        const stats = await stat(fullPath);
        const relativeFilePath = join(relativePath, entry);

        if (stats.isFile() && entry.endsWith('.spec.js')) {
          files.push(relativeFilePath);
        } else if (stats.isDirectory() && !entry.includes('examples')) {
          await scanRulesForSpecs(fullPath, relativeFilePath);
        }
      }
    } catch (error) {
      console.warn(
        `⚠️  Could not read rules directory ${relativePath}:`,
        error.message
      );
    }
  }

  await scanRulesForSpecs(join(projectRoot, "rules"), "rules");

  // Check for specific test files in root directory
  const rootTestFiles = [];
  for (const testFile of rootTestFiles) {
    const fullPath = join(projectRoot, testFile);
    try {
      const stats = await stat(fullPath);
      if (stats.isFile()) {
        files.push(testFile);
      }
    } catch (error) {
      // File doesn't exist, skip
    }
  }

  return files.sort();
}

async function runTestCategory(eslint, category, config) {
  console.log(`\n📁 Testing category: ${category}`);
  console.log(`   ${config.description}`);

  let categoryPassed = true;
  const categoryResults = {
    totalErrors: 0,
    totalWarnings: 0,
    rulesCovered: new Set(),
    fileResults: [],
  };

  for (const file of config.files) {
    const filePath = join(projectRoot, file);

    try {
      const results = await eslint.lintFiles([filePath]);
      const result = results[0];

      if (result) {
        const errorCount = result.errorCount;
        const warningCount = result.warningCount;

        categoryResults.totalErrors += errorCount;
        categoryResults.totalWarnings += warningCount;
        categoryResults.fileResults.push({
          file,
          errors: errorCount,
          warnings: warningCount,
          messages: result.messages,
        });

        // Collect rules that were triggered
        result.messages.forEach((msg) => {
          if (msg.ruleId) {
            categoryResults.rulesCovered.add(msg.ruleId);
          }
        });

        console.log(
          `   📄 ${file}: ${errorCount} errors, ${warningCount} warnings`
        );

        // Show top errors/warnings for debugging
        if (result.messages.length > 0) {
          const topMessages = result.messages.slice(0, 3);
          topMessages.forEach((msg) => {
            const level = msg.severity === 2 ? "❌" : "⚠️ ";
            console.log(
              `      ${level} Line ${msg.line}: ${msg.message} (${
                msg.ruleId || "unknown"
              })`
            );
          });

          if (result.messages.length > 3) {
            console.log(
              `      ... and ${result.messages.length - 3} more issues`
            );
          }
        }
      }
    } catch (error) {
      console.error(`   ❌ Error linting ${file}:`, error.message);
      categoryPassed = false;
    }
  }

  // Validate category expectations
  if (categoryResults.totalErrors > config.maxErrors) {
    console.log(
      `   ❌ Too many errors: ${categoryResults.totalErrors} > ${config.maxErrors}`
    );
    categoryPassed = false;
  }

  if (categoryResults.totalWarnings > config.maxWarnings) {
    console.log(
      `   ❌ Too many warnings: ${categoryResults.totalWarnings} > ${config.maxWarnings}`
    );
    categoryPassed = false;
  }

  // Check for expected rules
  if (config.expectedRules) {
    const missingRules = config.expectedRules.filter(
      (rule) => !categoryResults.rulesCovered.has(rule)
    );

    if (missingRules.length > 0) {
      console.log(
        `   ⚠️  Expected rules not found: ${missingRules.join(", ")}`
      );
    }

    if (categoryResults.rulesCovered.size > 0) {
      console.log(
        `   ✅ Rules covered: ${Array.from(categoryResults.rulesCovered).join(
          ", "
        )}`
      );
    }
  }

  const status = categoryPassed ? "✅" : "❌";
  console.log(
    `   ${status} Category result: ${categoryResults.totalErrors} errors, ${categoryResults.totalWarnings} warnings`
  );

  return { passed: categoryPassed, results: categoryResults };
}

async function runStandaloneTest(testFile) {
  console.log(`🧪 Running standalone test: ${testFile}`);

  return new Promise((resolve) => {
    const child = spawn("node", [join(projectRoot, testFile)], {
      stdio: "pipe",
      cwd: projectRoot,
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      const passed = code === 0;

      if (passed) {
        console.log(`   ✅ Test passed: ${testFile}`);
        // Show last line of stdout (usually success message)
        const lines = stdout.trim().split('\n');
        if (lines.length > 0) {
          console.log(`   📝 ${lines[lines.length - 1]}`);
        }
      } else {
        console.log(`   ❌ Test failed: ${testFile} (exit code: ${code})`);
        if (stderr) {
          console.log(`   📝 Error: ${stderr.trim()}`);
        }
        if (stdout) {
          console.log(`   📝 Output: ${stdout.trim()}`);
        }
      }

      resolve({ passed, file: testFile });
    });

    child.on("error", (error) => {
      console.log(`   ❌ Failed to run test: ${testFile}`);
      console.log(`   📝 Error: ${error.message}`);
      resolve({ passed: false, file: testFile });
    });
  });
}

async function runStandaloneTests(testFiles) {
  if (testFiles.length === 0) return { passed: true, results: [] };

  console.log(`\n📁 Running ${testFiles.length} standalone test(s):`);
  const results = [];

  for (const testFile of testFiles) {
    const result = await runStandaloneTest(testFile);
    results.push(result);
  }

  const allPassed = results.every(r => r.passed);
  const passedCount = results.filter(r => r.passed).length;

  console.log(`   📊 Results: ${passedCount}/${results.length} tests passed`);

  return { passed: allPassed, results };
}

async function generateTestReport(allResults, standaloneResult = null) {
  console.log("\n" + "=".repeat(80));
  console.log("📊 TEST REPORT SUMMARY");
  console.log("=".repeat(80));

  let overallPassed = true;
  let totalErrors = 0;
  let totalWarnings = 0;
  const allRulesCovered = new Set();

  // Report ESLint category results
  for (const [category, { passed, results }] of Object.entries(allResults)) {
    const status = passed ? "✅" : "❌";
    console.log(
      `${status} ${category}: ${results.totalErrors} errors, ${results.totalWarnings} warnings`
    );

    if (!passed) overallPassed = false;
    totalErrors += results.totalErrors;
    totalWarnings += results.totalWarnings;

    results.rulesCovered.forEach((rule) => allRulesCovered.add(rule));
  }

  // Report standalone test results
  if (standaloneResult && standaloneResult.results.length > 0) {
    const status = standaloneResult.passed ? "✅" : "❌";
    const passedCount = standaloneResult.results.filter(r => r.passed).length;
    console.log(`${status} standalone-tests: ${passedCount}/${standaloneResult.results.length} tests passed`);

    if (!standaloneResult.passed) {
      overallPassed = false;
    }
  }

  console.log("\n📋 Overall Statistics:");
  console.log(`   Total Errors: ${totalErrors}`);
  console.log(`   Total Warnings: ${totalWarnings}`);
  console.log(`   Rules Covered: ${allRulesCovered.size}`);
  console.log(`   Categories Tested: ${Object.keys(allResults).length}`);

  console.log("\n🔧 Rules Coverage:");
  const sortedRules = Array.from(allRulesCovered).sort();
  for (let i = 0; i < sortedRules.length; i += 3) {
    const chunk = sortedRules.slice(i, i + 3);
    console.log(`   ${chunk.join(", ")}`);
  }

  console.log("\n" + "=".repeat(80));

  if (overallPassed) {
    console.log("🎉 ALL TESTS PASSED!");
    return true;
  } else {
    console.log("💥 SOME TESTS FAILED!");
    return false;
  }
}

function autoCategorizeFiles(allTestFiles) {
  const autoCategories = {};
  const uncategorizedFiles = [];

  // First, assign files to predefined categories
  for (const [category, config] of Object.entries(testCategories)) {
    const existingFiles = config.files.filter((file) =>
      allTestFiles.includes(file)
    );
    if (existingFiles.length > 0) {
      autoCategories[category] = { ...config, files: existingFiles };
    }
  }

  // Find files that aren't in any predefined category
  const categorizedFiles = new Set();
  for (const category of Object.values(autoCategories)) {
    category.files.forEach((file) => categorizedFiles.add(file));
  }

  for (const file of allTestFiles) {
    if (!categorizedFiles.has(file)) {
      uncategorizedFiles.push(file);
    }
  }

  // Auto-categorize uncategorized files based on path patterns
  if (uncategorizedFiles.length > 0) {
    const pathCategories = {
      "auto-export-tests": {
        description: "Auto-discovered export-related tests",
        files: uncategorizedFiles.filter(
          (file) =>
            file.includes("/export/") ||
            file.includes("export") ||
            file.includes("Export")
        ),
        maxErrors: 32,
        maxWarnings: 2,
        expectedRules: ["no-restricted-syntax"],
      },
      "auto-component-tests": {
        description: "Auto-discovered component tests",
        files: uncategorizedFiles.filter(
          (file) =>
            (file.includes("component") || file.includes("Component")) &&
            !file.includes("/export/")
        ),
        maxErrors: 5,
        maxWarnings: 15,
      },
      "auto-type-tests": {
        description: "Auto-discovered type-related tests",
        files: uncategorizedFiles.filter(
          (file) =>
            (file.includes("type") ||
              file.includes("Type") ||
              file.includes("interface") ||
              file.includes("Interface")) &&
            !file.includes("/export/") &&
            !file.includes("component")
        ),
        maxErrors: 25,
        maxWarnings: 20,
        expectedRules: [
          "no-restricted-syntax",
          "@typescript-eslint/no-explicit-any",
        ],
      },
      "auto-misc-tests": {
        description: "Auto-discovered miscellaneous tests",
        files: uncategorizedFiles.filter(
          (file) =>
            !file.includes("/export/") &&
            !file.includes("export") &&
            !file.includes("Export") &&
            !file.includes("component") &&
            !file.includes("Component") &&
            !file.includes("type") &&
            !file.includes("Type") &&
            !file.includes("interface") &&
            !file.includes("Interface")
        ),
        maxErrors: 0,
        maxWarnings: 0,
      },
    };

    // Add non-empty auto-categories
    for (const [category, config] of Object.entries(pathCategories)) {
      if (config.files.length > 0) {
        autoCategories[category] = config;
      }
    }
  }

  return autoCategories;
}

async function runComprehensiveTests() {
  console.log("🚀 Starting Comprehensive ESLint Configuration Tests");
  console.log("=".repeat(60));

  try {
    // Initialize ESLint
    const eslint = new ESLint({
      overrideConfigFile: join(projectRoot, "eslint.config.js"),
    });

    // Discover all test files
    const allTestFiles = await findTestFiles();
    console.log(`📁 Discovered ${allTestFiles.length} test files:`);
    allTestFiles.forEach((file) => console.log(`   - ${file}`));

    // Separate standalone test files from lint test files
    const standaloneTestFiles = allTestFiles.filter(file =>
      file.endsWith('.test.js') || file.endsWith('.spec.js')
    );
    const lintTestFiles = allTestFiles.filter(file =>
      !file.endsWith('.test.js') && !file.endsWith('.spec.js')
    );

    // Auto-categorize lint test files only (predefined + auto-discovered)
    const allCategories = autoCategorizeFiles(lintTestFiles);

    console.log(
      `\n📊 Test categories (${Object.keys(allCategories).length} total):`
    );
    for (const [category, config] of Object.entries(allCategories)) {
      const autoPrefix = category.startsWith("auto-") ? "🔍 " : "📋 ";
      console.log(
        `   ${autoPrefix}${category}: ${config.files.length} files - ${config.description}`
      );
    }

    // Run tests by category
    const allResults = {};

    // Run ESLint categories
    for (const [category, config] of Object.entries(allCategories)) {
      const result = await runTestCategory(eslint, category, config);
      allResults[category] = result;
    }

    // Run standalone test files
    const standaloneResult = await runStandaloneTests(standaloneTestFiles);

    // Generate final report
    const overallPassed = await generateTestReport(allResults, standaloneResult);

    if (overallPassed) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Test runner failed:", error);
    process.exit(1);
  }
}

// Handle CLI arguments
const args = process.argv.slice(2);
const showHelp = args.includes("--help") || args.includes("-h");

if (showHelp) {
  console.log(`
ESLint Configuration Test Runner

Usage:
  node scripts/test-runner.js [options]

Options:
  -h, --help     Show this help message
  --verbose      Show detailed output
  --category     Run specific category only

Examples:
  node scripts/test-runner.js
  node scripts/test-runner.js --verbose
  node scripts/test-runner.js --category=hooks
  `);
  process.exit(0);
}

runComprehensiveTests();
